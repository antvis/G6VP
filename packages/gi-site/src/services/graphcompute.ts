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

/**
 * 将点边文件数据加载进 GraphScope 引擎
 * @param params
 */
export const loadGraphToGraphScope = async (params: LoadGraphParams) => {
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
      edges: [],
    },
  };

  if (edgeFilePath) {
    loadFileParams.dataSource.edges.push({
      label: edgeType,
      location: edgeFilePath,
      srcLabel: sourceNodeType,
      dstLabel: targetNodeType,
      config: {
        header_row: hasHeaderRow,
        delimiter,
      },
    });
  }

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

export const findNodeById = async nodeId => {
  const response = await request(`${SERVICE_URL_PREFIX}/graphcompute/findVertex`, {
    method: 'get',
    params: {
      nodeId,
    },
  });

  return response;
};

// queryByGremlinLanguage
export const gremlinQuery = async (statement: string) => {
  const response = await request(`${SERVICE_URL_PREFIX}/graphcompute/gremlinQuery`, {
    method: 'get',
    params: {
      statement,
    },
  });

  return response;
};

interface ICloseGraphParams {
  instanceId: string;
  graphName: string;
}
/**
 * 关闭启动的 GraphScope 引擎
 */
export const closeGraphInstance = async (params: ICloseGraphParams) => {
  const result = await request(`${SERVICE_URL_PREFIX}/graphcompute/closeGraph`, {
    method: 'POST',
    data: params,
  });

  return result;
};
