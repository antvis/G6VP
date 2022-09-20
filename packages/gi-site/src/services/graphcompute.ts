import request from 'umi-request';
import { message } from 'antd'
import { SERVICE_URL_PREFIX, IS_LOCAL_ENV, LOCAL_GRAPHSCOPE_SERVER } from './const';
import { findEngineInstanceByProjectID, updateEngineInstace, createEngineInstance, deleteInstance } from './engineInstace';

/**
 * 初始化 GraphScope 引擎
 * @param projectId 项目 ID
 * @param mode 创建实例模式，1 表示本地载图的 session 实例，2 表示 odps 载图的 session 实例
 */
export const createGraphScopeInstance = async (projectId: string, mode: string = 'LOCAL') => {
  if (IS_LOCAL_ENV) {
    const graphScopeInstance = localStorage.getItem('GRAPHSCOPE_INSTANCE')
    
    if (graphScopeInstance) {
      return {
        success: true,
        data: {
          instanceId: graphScopeInstance
        }
      }
    }
    const gsResult = await request(`${LOCAL_GRAPHSCOPE_SERVER}/graphcompute/createGSInstance`, {
      method: 'POST',
      data: {
        mode
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!gsResult || !gsResult.success) {
      message.error(`创建 GraphScope 引擎实例失败: ${gsResult.message}`);
      return null;
    }

    // 将创建的 GS 实例存储到 localStorage 中
    localStorage.setItem('GRAPHSCOPE_INSTANCE', gsResult.data.instanceId)
    return gsResult
  }

  const engineMode = mode === 'LOCAL' ? 1 : 2
  // 创建实例之前，先查找是否之前已经创建过图引擎实例
  const instanceResult = await findEngineInstanceByProjectID(projectId, engineMode)
  if (instanceResult.success && instanceResult.data.length > 0) {
    const currentInstance = instanceResult.data[0]
    const { instanceId } = currentInstance
    return {
      success: true,
      data: {
        instanceId
      }
    }
  }

  const gsResult = await request(`${SERVICE_URL_PREFIX}/graphcompute/createGSInstance`, {
    method: 'POST',
    data: {
      mode
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!gsResult || !gsResult.success) {
    message.error(`创建 GraphScope 引擎实例失败: ${gsResult.message}`);
    return null;
  }

  const { data } = gsResult;
  const { instanceId: newInstanceId } = data;

  await createEngineInstance({
    projectId,
    instanceId: newInstanceId,    
    mode: engineMode
  })

  return gsResult;
};

interface UploadFileParams {
  instanceId: string;
  fileList: any;
}

interface UploadFileResponse {
  success: boolean;
  data: {
    filePath: string;
    fileName: string;
  };
}

/**
 * 上传本地数据文件并导入到 GraphScope 引擎中
 * @param params
 */
export const uploadLocalFileToGraphScope = async (params: UploadFileParams): Promise<UploadFileResponse> => {
  const { instanceId, fileList } = params;

  const uploadServerURL = IS_LOCAL_ENV ? LOCAL_GRAPHSCOPE_SERVER : SERVICE_URL_PREFIX
  const nodeFormData = new FormData();
  nodeFormData.append('file', fileList.file);
  nodeFormData.append('instance_id', instanceId);

  const fileResult = await request(`${uploadServerURL}/graphcompute/uploadFile`, {
    method: 'post',
    data: nodeFormData,
    contentType: false,
    processData: false,
  });

  if (!fileResult || !fileResult.success) {
    return fileResult;
  }

  return {
    success: true,
    data: fileResult.data,
  };
};

interface LoadGraphParams {
  projectId: string;
  nodeFilePath: any;
  edgeFilePath?: any;
  directed?: boolean;
  nodeType: string;
  edgeType?: string;
  sourceNodeType?: string;
  targetNodeType?: string;
  delimiter?: string;
  hasHeaderRow?: boolean;
}

interface LoadGraphDataParams {
  projectId: string;
  nodeConfigList: any;
  edgeConfigList: any;
  fileMapping: any;
  directed?: boolean;
  delimiter?: string;
  hasHeaderRow?: boolean;
  isStringType?: boolean;
}

/**
 * 将点边文件数据加载进 GraphScope 引擎
 * @param params
 */
export const loadGraphToGraphScope = async (params: LoadGraphDataParams) => {
  const { projectId, nodeConfigList, edgeConfigList, fileMapping, isStringType, directed = true, delimiter = ',', hasHeaderRow = true } = params;
  
  const instanceResult = await createGraphScopeInstance(projectId)

  if (!instanceResult.success) {
    return
  }

  const { instanceId } = instanceResult.data

  // 构造载图时的 nodes 对象
  const nodeSources = nodeConfigList.filter(d => {
    // nodeType 必须存在
    
    // nodeFileList 必须存在，
    const { nodeType, nodeFileList } = d

    // filePath 必须存在
    const filePath = fileMapping[nodeFileList?.file?.name]

    return nodeType && filePath
  }).map(d => {
    const { nodeType, nodeFileList } = d;
    return {
      label: nodeType,
      location: fileMapping[nodeFileList.file.name],
      config: {
        header_row: hasHeaderRow,
        delimiter,
      },
    };
  });

  const edgeSources = edgeConfigList.filter(d => {
    // edgeType source target 都必须存在
    const { edgeType, edgeFileList, sourceNodeType, targetNodeType } = d
    const filePath = fileMapping[edgeFileList?.file?.name]
    return edgeType && filePath && sourceNodeType && targetNodeType
  }).map(d => {
    const { edgeType, sourceNodeType, targetNodeType, edgeFileList } = d;
    return {
      label: edgeType,
      location: fileMapping[edgeFileList.file.name],
      srcLabel: sourceNodeType,
      dstLabel: targetNodeType,
      config: {
        header_row: hasHeaderRow,
        delimiter,
      },
    };
  });

  const loadFileParams = {
    type: 'LOCAL',
    directed,
    oid_type: isStringType ? 'string' : 'int64_t',
    instance_id: instanceId,
    dataSource: {
      nodes: nodeSources,
      edges: edgeSources,
    },
  };

  console.log('载图参数', loadFileParams);
  const loadDataServerURL = IS_LOCAL_ENV ? LOCAL_GRAPHSCOPE_SERVER : SERVICE_URL_PREFIX

  const loadResult = await request(`${loadDataServerURL}/graphcompute/loadData`, {
    method: 'post',
    data: loadFileParams,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!loadResult || !loadResult.success) {
    return loadResult;
  }

  const { graphURL, graphName, hostIp, hostName } = loadResult.data;
  
  if (!IS_LOCAL_ENV) {
    const updateInstanceResult = await updateEngineInstace(instanceId, {
      gremlinServerUrl: graphURL,
      activeGraphName: graphName,
    })
  
    if (!updateInstanceResult || !updateInstanceResult.success) {
      message.error(updateInstanceResult.errorMsg);
      return null
    }
  } else {
    localStorage.setItem('graphScopeGraphName', graphName)
    localStorage.setItem('graphScopeGremlinServer', graphURL)
  }

  return {
    success: true,
    data: {
      graphURL,
      graphName,
      hostIp,
      hostName,
    },
  };
};

interface ChinaVisParams {
  projectId: string;
  dataSource: any;
}
/**
 * 将 ChinaVis 示例数据载入到 GraphScope 中
 * @param params 
 */
export const loadChinaVisGraphToGraphScope = async (params: ChinaVisParams) => {
  const { projectId, dataSource } = params

  const instanceResult = await createGraphScopeInstance(projectId)

  if (!instanceResult.success) {
    return
  }

  const { instanceId } = instanceResult.data
  const loadFileParams = {
    type: 'LOCAL',
    directed: true,
    oid_type: 'string',
    instance_id: instanceId,
    dataSource
  };

  console.log('载图参数', loadFileParams);
  const loadDataServerURL = IS_LOCAL_ENV ? LOCAL_GRAPHSCOPE_SERVER : SERVICE_URL_PREFIX

  const loadResult = await request(`${loadDataServerURL}/graphcompute/loadData`, {
    method: 'post',
    data: loadFileParams,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!loadResult || !loadResult.success) {
    return loadResult;
  }

  const { graphURL, graphName, hostIp, hostName } = loadResult.data;

  if (!IS_LOCAL_ENV) {
    const updateInstanceResult = await updateEngineInstace(instanceId, {
      gremlinServerUrl: graphURL,
      activeGraphName: graphName,
    })
  
    if (!updateInstanceResult || !updateInstanceResult.success) {
      message.error(updateInstanceResult.errorMsg);
      return null
    }
  } else {
    localStorage.setItem('graphScopeGraphName', graphName)
    localStorage.setItem('graphScopeGremlinServer', graphURL)
  }

  return {
    success: true,
    data: {
      graphURL,
      graphName,
      hostIp,
      hostName,
    },
  };
}

// queryByGremlinLanguage
export const gremlinQuery = async (value: string) => {
  if (IS_LOCAL_ENV) {
    const gremlinServer = localStorage.getItem('graphScopeGremlinServer')
    const response = await request(`${LOCAL_GRAPHSCOPE_SERVER}/graphcompute/gremlinQuery`, {
      method: 'post',
      data: {
        value,
        gremlinServer
      },
    });
  
    return response;
  }

  const response = await request(`${SERVICE_URL_PREFIX}/graphcompute/gremlinQuery`, {
    method: 'post',
    data: {
      value,
      projectId: localStorage.getItem('GI_ACTIVE_PROJECT_ID'),
      mode: localStorage.getItem('GI_CURRENT_QUERY_MODE') === 'ODPS' ? 2 : 1,
    },
  });

  return response;
};

interface NeighborsProps {
  id: string[];
  sep: number;
}

/**
 * 
 * @param id 查询节点属性
 */
export const queryNeighbors = async (params: NeighborsProps) => {
  if (IS_LOCAL_ENV) {
    const gremlinServer = localStorage.getItem('graphScopeGremlinServer')
    const response = await request(`${LOCAL_GRAPHSCOPE_SERVER}/graphcompute/neighbors`, {
      method: 'post',
      data: {
        ...params,
        gremlinServer
      },
    });
  
    return response;
  }

  const response = await request(`${SERVICE_URL_PREFIX}/graphcompute/neighbors`, {
    method: 'post',
    data: params,
  });

  return response;
}

/**
 * 
 * @param id 查询节点属性
 */
export const queryElementProperties = async (id) => {

  if (IS_LOCAL_ENV) {
    const response = await request(`${LOCAL_GRAPHSCOPE_SERVER}/graphcompute/properties`, {
      method: 'post',
      data: {
        id: [id],
        projectId: localStorage.getItem('GI_ACTIVE_PROJECT_ID'),
        mode: localStorage.getItem('GI_CURRENT_QUERY_MODE') === 'ODPS' ? 2 : 1,
      },
    });
  
    return response;
  }
  const response = await request(`${SERVICE_URL_PREFIX}/graphcompute/properties`, {
    method: 'post',
    data: {
      id: [id],
      projectId: localStorage.getItem('GI_ACTIVE_PROJECT_ID'),
      mode: localStorage.getItem('GI_CURRENT_QUERY_MODE') === 'ODPS' ? 2 : 1,
    },
  });

  return response;
}

/**
 * 关闭启动的 GraphScope 引擎
 */
export const closeGraphInstance = async (projectId: string, mode: string = 'LOCAL') => {
  if (IS_LOCAL_ENV) {
    const localInstance = localStorage.getItem('GRAPHSCOPE_INSTANCE')
    const result = await request(`${LOCAL_GRAPHSCOPE_SERVER}/graphcompute/closeGSInstance`, {
      method: 'GET',
      params: {
        instanceId: localInstance,
      },
    });
    
    return result;
  }
  const engineMode = mode === 'LOCAL' ? 1 : 2
  // 关闭实例之前，先查询相关信息
  const instanceResult = await findEngineInstanceByProjectID(projectId, engineMode);
  if (!instanceResult.success || instanceResult.data.length === 0) {
    message.error(`查找ID为 ${projectId} 的实例失败或不存在`);
    return null
  }

  const currentInstance = instanceResult.data[0]

  const { instanceId } = currentInstance;

  if (!instanceId) {
    message.error(`实例不存在`);
    return null
  }

  const result = await request(`${SERVICE_URL_PREFIX}/graphcompute/closeGSInstance`, {
    method: 'GET',
    params: {
      instanceId,
      mode
    },
  });

  await deleteInstance(instanceId)

  return result;
};

interface GraphAlgorithmProps {
  name: 'pagerank' | 'clustering' | 'sssp' | 'wcc' | 'eigenvector_centrality' | 'k_core';
  graphName: string;
  limit?: number;
  sortById?: boolean;
  maxRound?: number;
  delta?: number;
  weight?: string;
  // sssp 算法 src 必选
  src?: string;
  tolerance?: number;
  // k-core 算法 k 必选
  k?: number;
  // 算法结果写到该字段中
  colomnName?: string;
}

// 调用图算法
export const execGraphAlgorithm = async (params: GraphAlgorithmProps) => {
  const serverURL = IS_LOCAL_ENV ? LOCAL_GRAPHSCOPE_SERVER : SERVICE_URL_PREFIX

  const result = await request(`${serverURL}/graphcompute/execAlgorithm`, {
    method: 'POST',
    data: params
  })

  return result
}

/**
 * 查询 GraphScope 中载入图的 Schema
 * @param projectId 项目 ID
 */
export const queryGraphSchema = async (projectId: string, modeType) => {
  if (IS_LOCAL_ENV) {
    const localGraphName = localStorage.getItem('graphScopeGraphName')
    const result = await request(`${LOCAL_GRAPHSCOPE_SERVER}/graphcompute/schema`, {
      method: 'GET',
      params: {
        graphName: localGraphName
      }
    })
  
    return result
  }
  const engineMode = modeType === 'LOCAL' ? 1 : 2
  const result = await request(`${SERVICE_URL_PREFIX}/graphcompute/schema`, {
    method: 'GET',
    params: {
      projectId,
      mode: engineMode
    }
  })

  return result
}

/**
 * 将图 pattern 转换为 Gremlin 查询语句
 * @param pattern JSON 描述的 Pattern
 */
export const jsonToGremlin = async (pattern) => {
  const serverURL = IS_LOCAL_ENV ? LOCAL_GRAPHSCOPE_SERVER : SERVICE_URL_PREFIX

  const result = await request(`${serverURL}/graphcompute/jsonToGremlin`, {
    method: 'POST',
    data: {
      value: JSON.stringify(pattern)
    }
  })

  return result
}

interface CrateCupIdInstanceProps {
  projectId: string;
  accessId: string;
  accessKey: string;
  project: string;
  endpoint: string;
}

/**
 * 创建 cupid 实例
 * @param params 
 */
export const createCupidInstance = async (params: CrateCupIdInstanceProps) => {
  const { projectId, ...others } = params
  // 创建实例之前，先查找是否之前已经创建过图引擎实例
  const instanceResult = await findEngineInstanceByProjectID(projectId, 2)
  console.log('查询', instanceResult)
  if (instanceResult.success && instanceResult.data.length > 0) {
    const currentInstance = instanceResult.data[0]
    const { instanceId } = currentInstance
    return {
      success: true,
      data: {
        instanceId
      }
    }
  }

  const result = await request(`${SERVICE_URL_PREFIX}/graphcompute/createCupidInstance`, {
    method: 'POST',
    data: others
  })

  if (!result || !result.success) {
    message.error(`创建 GraphScope 引擎实例失败: ${result.message}`);
    return null;
  }

  // 丘比特实例 
  const { instance_id, httpserver } = result;
  console.log('创建cupid', instance_id, httpserver)

  await createEngineInstance({
    projectId,
    instanceId: instance_id,   
    // 丘比特实例 
    mode: 2
  })

  return result
}

/**
 * 关闭 cupid 实例
 * @param params 
 */
export const closeCupidInstance = async (projectId: string) => {
  // 关闭实例之前，先查询相关信息
  const instanceResult = await findEngineInstanceByProjectID(projectId, 2);
  if (!instanceResult.success || instanceResult.data.length === 0) {
    message.error(`查找ID为 ${projectId} 的实例失败或不存在`);
    return null
  }

  const currentInstance = instanceResult.data[0]

  const { instanceId } = currentInstance;

  if (!instanceId) {
    message.error(`实例不存在`);
    return null
  }

  const result = await request(`${SERVICE_URL_PREFIX}/graphcompute/closeCupidInstance`, {
    method: 'GET',
    params: {
      cupid: instanceId
    }
  })

  await deleteInstance(instanceId)

  return result
}

interface LoadODPSDataParams {
  projectId: string;
  project: string;
  nodeConfigList: any;
  edgeConfigList: any;
  isStringType?: boolean;
}

/**
 * 将点边文件数据加载进 GraphScope 引擎
 * @param params
 */
export const loadOdpsDataToGraphScope = async (params: LoadODPSDataParams) => {
  const { project, projectId, nodeConfigList, edgeConfigList, isStringType } = params;
  
  const instanceResult = await createGraphScopeInstance(projectId, 'ODPS')

  if (!instanceResult.success) {
    return
  }

  const { instanceId } = instanceResult.data

  // 构造载图时的 nodes 对象
  const nodeSources = nodeConfigList.filter(d => {
    // nodeType 必须存在
    const { nodeType } = d
    return nodeType
  }).reduce((pre, cur) => {
    const { nodeType, partitionName, tableNames, idField } = cur;
    const nodeTables = tableNames.map(t => {
      return {
        label: nodeType,
        id_field: idField,
        location: partitionName ? `odps:///${project}/${t}/${partitionName}` : `odps:///${project}/${t}`,
        config: {},
      };
    });

    return pre.concat(nodeTables);
  }, []);

  const edgeSources = edgeConfigList.filter(d => {
    // edgeType source target 都必须存在
    const { edgeType, sourceNodeType, targetNodeType } = d
    return edgeType && sourceNodeType && targetNodeType
  }).reduce((pre, cur) => {
    const { edgeType, sourceNodeType, targetNodeType, tableNames, srcField, dstField, partitionName } = cur;
    const edgeTables = tableNames.map(t => {
      return {
        label: edgeType,
        location: partitionName ? `odps:///${project}/${t}/${partitionName}` : `odps:///${project}/${t}`,
        srcLabel: sourceNodeType,
        dstLabel: targetNodeType,
        srcField,
        dstField,
        config: {
        },
      };
    })

    return pre.concat(edgeTables);
  }, []);

  const loadFileParams = {
    type: 'ODPS',
    directed: true,
    oid_type: isStringType ? 'string' : 'int64_t',
    instance_id: instanceId,
    dataSource: {
      nodes: nodeSources,
      edges: edgeSources,
    },
  };

  console.log('载图参数', loadFileParams);

  const loadResult = await request(`${SERVICE_URL_PREFIX}/graphcompute/loadData`, {
    method: 'post',
    data: loadFileParams,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!loadResult || !loadResult.success) {
    return loadResult;
  }

  const { graphURL, graphName, hostIp, hostName } = loadResult.data;
  
  const updateInstanceResult = await updateEngineInstace(instanceId, {
    gremlinServerUrl: graphURL,
    activeGraphName: graphName,
  })

  if (!updateInstanceResult || !updateInstanceResult.success) {
    message.error(updateInstanceResult.errorMsg);
    return null
  }

  return {
    success: true,
    data: {
      graphURL,
      graphName,
      hostIp,
      hostName,
    },
  };
};

/**
 * 查询当前机器上所有的 GraphScope 实例
 */
export const getGraphScopeInstances = async () => {
  const result = await request(`${SERVICE_URL_PREFIX}/graphcompute/instances`, {
    method: 'get'
  })

  return result
}