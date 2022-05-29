import request from 'umi-request';
import { SERVICE_URL_PREFIX } from './const';

/**
 * 初始化 GraphScope 引擎
 * session_txlyagpj
 */
export const createGraphScopeInstance = async () => {
  const gsResult = await request(`${SERVICE_URL_PREFIX}/graphcompute/createGSInstance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

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
  instanceId: string;
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
  instanceId: string;
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
  const { instanceId, nodeConfigList, edgeConfigList, fileMapping, isStringType, directed = true, delimiter = ',', hasHeaderRow = true } = params;
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
    instanceId,
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
  instanceId: string;
  dataSource: any;
}
/**
 * 将 ChinaVis 示例数据载入到 GraphScope 中
 * @param params 
 */
export const loadChinaVisGraphToGraphScope = async (params: ChinaVisParams) => {
  const { instanceId, dataSource } = params
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
export const closeGraphInstance = async (instanceId: string) => {
  const result = await request(`${SERVICE_URL_PREFIX}/graphcompute/closeGSInstance`, {
    method: 'GET',
    params: {
      instanceId,
    },
  });

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
}

// 调用图算法
export const execGraphAlgorithm = async (params: GraphAlgorithmProps) => {
  const result = await request(`${SERVICE_URL_PREFIX}/graphcompute/execAlgorithm`, {
    method: 'POST',
    data: params
  })
  return result
}
