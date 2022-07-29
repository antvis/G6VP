import request from "umi-request";
import { HTTP_SERVICE_URL } from "./Constants";
import {
  findEngineInstanceByProjectID,
  createEngineInstance,
  deleteInstance,
  updateEngineInstace
} from "./engineInstance";

export const createGraphScopeInstance = {
  name: "创建 GraphScope 引擎实例",
  service: async (engineMode: string = 'LOCAL') => {
    const projectId = localStorage.getItem("GI_ACTIVE_PROJECT_ID") as string;
    // const context =  localStorage.getItem("GS_SERVER_CONTEXT");
    const currentMode = localStorage.getItem("GI_CURRENT_QUERY_MODE") || engineMode
    const mode = currentMode === "ODPS" ? 2 : 1;

    // 创建实例之前，先查找是否之前已经创建过图引擎实例
    const instanceResult = await findEngineInstanceByProjectID(
      projectId,
      mode
    );
    if (instanceResult.success && instanceResult.data.length > 0) {
      const currentInstance = instanceResult.data[0];
      const { instanceId } = currentInstance;
      return {
        success: true,
        data: {
          instanceId
        }
      };
    }

    const gsResult = await request(
      `${HTTP_SERVICE_URL}/graphcompute/createGSInstance`,
      {
        method: "POST",
        data: {
          mode: currentMode
        },
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!gsResult || !gsResult.success) {
      return gsResult;
    }

    const { data } = gsResult;
    const { instanceId: newInstanceId } = data;

    await createEngineInstance({
      projectId,
      instanceId: newInstanceId,
      mode
    });

    return gsResult;
  }
};

export const closeGraphInstance = {
  name: "上传文件至 GraphScope 服务器",
  service: async () => {
    const projectId = localStorage.getItem("GI_ACTIVE_PROJECT_ID") as string;
    // const context =  localStorage.getItem("GS_SERVER_CONTEXT");
    const mode =
      localStorage.getItem("GI_CURRENT_QUERY_MODE") === "ODPS" ? 2 : 1;

    // 关闭实例之前，先查询相关信息
    const instanceResult = await findEngineInstanceByProjectID(projectId, mode);
    if (!instanceResult.success || instanceResult.data.length === 0) {
      return instanceResult;
    }

    const currentInstance = instanceResult.data[0];

    const { instanceId } = currentInstance;

    if (!instanceId) {
      return instanceResult;
    }

    const result = await request(
      `${HTTP_SERVICE_URL}/graphcompute/closeGSInstance`,
      {
        method: "GET",
        params: {
          instanceId,
          mode
        }
      }
    );

    await deleteInstance(instanceId);

    return result;
  }
};

export const uploadLocalFileToGraphScope = {
  name: "上传文件至 GraphScope 服务器",
  service: async (params) => {
    const { instanceId, fileList } = params;

    const nodeFormData = new FormData();
    nodeFormData.append('file', fileList.file);
    nodeFormData.append('instance_id', instanceId);

    const fileResult = await request(`${HTTP_SERVICE_URL}/graphcompute/uploadFile`, {
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
  }
};

export const loadGraphToGraphScope = {
  name: "将数据载入到 GraphScope 引擎中",
  service: async (params) => {
    const { nodeConfigList, edgeConfigList, fileMapping, isStringType, directed = true, delimiter = ',', hasHeaderRow = true } = params;
  
    const instanceResult = await createGraphScopeInstance.service()

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

    const loadResult = await request(`${HTTP_SERVICE_URL}/graphcompute/loadData`, {
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
      return updateInstanceResult
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
};


export const loadChinaVisGraphToGraphScope = {
  name: "将 ChianVis 数据载入到 GraphScope 引擎中",
  service: async (params) => {
    // const context =  localStorage.getItem("GS_SERVER_CONTEXT");
    
    const { dataSource } = params

    const instanceResult = await createGraphScopeInstance.service()
  
    if (!instanceResult.success) {
      return instanceResult
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
  
    const loadResult = await request(`${HTTP_SERVICE_URL}/graphcompute/loadData`, {
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
      return updateInstanceResult
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
};

export const loadDefaultGraphToGraphScope = {
  name: "将默认示例数据载入到 GraphScope 引擎中",
  service: async (params) => {
    // const context =  localStorage.getItem("GS_SERVER_CONTEXT");
    
    const {
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
  
    const instanceResult = await createGraphScopeInstance.service()
  
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
    
    const loadResult = await request(`${HTTP_SERVICE_URL}/graphcompute/loadData`, {
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
      return updateInstanceResult
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
};

export const loadOdpsDataToGraphScope = {
  name: '将 ODPS 数据表载入到 GraphScope 引擎中',
  service: async (params) => {
    const { project, projectId, nodeConfigList, edgeConfigList, isStringType } = params;
  
    const instanceResult = await createGraphScopeInstance.service('ODPS')

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

    const loadResult = await request(`${HTTP_SERVICE_URL}/graphcompute/loadData`, {
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
      return updateInstanceResult
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
}

export const queryGraphSchema = {
  name: '查询 GraphScope 载图后的 Schema',
  service: async () => {
    const projectId = localStorage.getItem("GI_ACTIVE_PROJECT_ID") as string;
    const engineMode =
      localStorage.getItem("GI_CURRENT_QUERY_MODE") === "ODPS" ? 2 : 1;
    
    const result = await request(`${HTTP_SERVICE_URL}/graphcompute/schema`, {
      method: 'GET',
      params: {
        projectId,
        mode: engineMode
      }
    })

    return result
  }
}

export const getGraphScopeInstances = {
  name: '查询 GraphScope 引擎实例列表',
  service: async () => {
    const result = await request(`${HTTP_SERVICE_URL}/graphcompute/instances`, {
      method: 'get'
    })
  
    return result
  }
}