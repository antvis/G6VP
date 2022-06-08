import request from 'umi-request';
import { message } from 'antd'
import { SERVICE_URL_PREFIX } from './const';
import { getProjectById, updateProjectById } from './index';

/**
 * 初始化 GraphScope 引擎
 * session_txlyagpj
 */
export const createGraphScopeInstance = async (projectId: string) => {
  const currentProject = await getProjectById(projectId);
  if (!currentProject) {
    message.error(`查找ID为 ${projectId} 的项目失败`);
    return null
  }

  const { expandInfo } = currentProject;
  if (expandInfo && expandInfo.instanceId) {
    const { instanceId } = expandInfo;
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
      projectId
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

  // 创建 GS 实例后，更新 expandInfo 字段
  let newExpandInfo = {
    ...expandInfo,
    instanceId: newInstanceId
  }
  
  const updateResult = await updateProjectById(projectId, {
    expandInfo: JSON.stringify(newExpandInfo)
  });
  if (!updateResult) {
    message.error(`更新ID为 ${projectId} 的项目失败`);
    return null;
  }

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

  const nodeFormData = new FormData();
  nodeFormData.append('file', fileList.file);
  nodeFormData.append('instance_id', instanceId);

  const fileResult = await request(`${SERVICE_URL_PREFIX}/graphcompute/uploadFile`, {
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
  
  const currentProject = await getProjectById(projectId);
  if (!currentProject) {
    message.error(`查找ID为 ${projectId} 的项目失败`);
    return null
  }

  const { expandInfo = {} } = currentProject;

  // 载图成功后更新 expandInfo 字段信息
  let newExpandInfo = {
    ...expandInfo,
    graphNameMapping: {
      ...expandInfo.graphNameMapping,
      [graphName]: graphURL
    },
    activeGraphName: graphName,
  }
  
  const updateResult = await updateProjectById(projectId, {
    expandInfo: JSON.stringify(newExpandInfo)
  });
  if (!updateResult) {
    message.error(`更新ID为 ${projectId} 的项目失败`)
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
 * 将默认点边文件数据加载进 GraphScope 引擎
 * @param params
 */
export const loadDefaultGraphToGraphScope = async (params: LoadGraphParams) => {
  const {
    projectId,
    nodeFilePath,
    edgeFilePath,
    directed = true,
    nodeType,
    edgeType,
    sourceNodeType,
    targetNodeType,
    delimiter = ',',
    hasHeaderRow = true,
  } = params;

  const instanceResult = await createGraphScopeInstance(projectId)

  if (!instanceResult.success) {
    return
  }

  const { instanceId } = instanceResult.data

  const loadFileParams = {
    type: 'LOCAL',
    directed,
    instance_id: instanceId,
    dataSource: {
      nodes: [
        {
          label: nodeType,
          location: nodeFilePath,
          config: {
            header_row: hasHeaderRow,
            delimiter,
          },
        },
      ],
      edges: [{
        label: edgeType,
        location: edgeFilePath,
        srcLabel: sourceNodeType,
        dstLabel: targetNodeType,
        config: {
          header_row: hasHeaderRow,
          delimiter,
        },
      }],
    },
  };

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

  const currentProject = await getProjectById(projectId);
  if (!currentProject) {
    message.error(`查找ID为 ${projectId} 的项目失败`);
    return null
  }

  const { expandInfo = {} } = currentProject;
  

  // 载图成功后更新 expandInfo 字段信息
  let newExpandInfo = {
    ...expandInfo,
    graphNameMapping: {
      ...expandInfo.graphNameMapping,
      [graphName]: graphURL
    },
    activeGraphName: graphName,
  }
  
  const updateResult = await updateProjectById(projectId, {
    expandInfo: JSON.stringify(newExpandInfo)
  });
  if (!updateResult) {
    message.error(`更新ID为 ${projectId} 的项目失败`)
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

  const currentProject = await getProjectById(projectId);
  if (!currentProject) {
    message.error(`查找ID为 ${projectId} 的项目失败`);
    return null
  }

  const { expandInfo } = currentProject;

  // 载图成功后更新 expandInfo 字段信息
  let newExpandInfo = {
    ...expandInfo,
    graphNameMapping: {
      ...expandInfo.graphNameMapping,
      [graphName]: graphURL
    },
    activeGraphName: graphName,
  }
  
  const updateResult = await updateProjectById(projectId, {
    expandInfo: JSON.stringify(newExpandInfo)
  });
  if (!updateResult) {
    message.error(`更新ID为 ${projectId} 的项目失败`)
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
}

export const findNodeById = async nodeId => {
  const response = await request(`${SERVICE_URL_PREFIX}/graphcompute/findVertex`, {
    method: 'get',
    params: {
      nodeId,
      gremlinServer: localStorage.getItem('graphScopeGremlinServer'),
    },
  });

  return response;
};

// queryByGremlinLanguage
export const gremlinQuery = async (statement: string) => {
  const response = await request(`${SERVICE_URL_PREFIX}/graphcompute/gremlinQuery`, {
    method: 'post',
    data: {
      statement,
      gremlinServer: localStorage.getItem('graphScopeGremlinServer'),
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
  const response = await request(`${SERVICE_URL_PREFIX}/graphcompute/neighbors`, {
    method: 'post',
    data: {
      ...params,
      gremlinServer: localStorage.getItem('graphScopeGremlinServer'),
    },
  });

  return response;
}

/**
 * 
 * @param id 查询节点属性
 */
export const queryElementProperties = async (id) => {
  const response = await request(`${SERVICE_URL_PREFIX}/graphcompute/properties`, {
    method: 'post',
    data: {
      id,
      gremlinServer: localStorage.getItem('graphScopeGremlinServer'),
    },
  });

  return response;
}

/**
 * 关闭启动的 GraphScope 引擎
 */
export const closeGraphInstance = async (projectId: string) => {
  // 关闭实例之前，先查询相关信息
  const currentProject = await getProjectById(projectId);
  if (!currentProject) {
    message.error(`查找ID为 ${projectId} 的项目失败`);
    return null
  }

  const { expandInfo = {} } = currentProject;
  const { instanceId } = expandInfo;
  if (!instanceId) {
    message.error(`GraphScope 实例 ${instanceId} 不存在`);
    return null
  }

  const result = await request(`${SERVICE_URL_PREFIX}/graphcompute/closeGSInstance`, {
    method: 'GET',
    params: {
      instanceId,
    },
  });

  const updateResult = await updateProjectById(projectId, {
    expandInfo: null
  });
  if (!updateResult) {
    message.error(`更新ID为 ${projectId} 的项目失败`);
    return null
  }

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
  const result = await request(`${SERVICE_URL_PREFIX}/graphcompute/execAlgorithm`, {
    method: 'POST',
    data: params
  })

  return result
}

/**
 * 查询 GraphScope 中载入图的 Schema
 */
export const queryGraphSchema = async () => {
  const result = await request(`${SERVICE_URL_PREFIX}/graphcompute/schema`, {
    method: 'GET',
    params: {
      graphName: localStorage.getItem('graphScopeGraphName')
    }
  })

  return result
}

/**
 * 将图 pattern 转换为 Gremlin 查询语句
 * @param pattern JSON 描述的 Pattern
 */
export const jsonToGremlin = async (pattern) => {
  const result = await request(`${SERVICE_URL_PREFIX}/graphcompute/jsonToGremlin`, {
    method: 'POST',
    data: {
      value: JSON.stringify(pattern)
    }
  })

  return result
}

interface AddColumnsProps {
  contextName: string;
  colomnName: string;
  needGremlin?: boolean;
}

/**
 * 将算法执行结果写到数据中
 * @param params 
 */
export const addColumns = async (params: AddColumnsProps) => {
  const result = await request(`${SERVICE_URL_PREFIX}/graphcompute/addColumns`, {
    method: 'POST',
    data: {
      ...params,
      graphName: localStorage.getItem('graphScopeGraphName'),
    }
  })

  return result
}