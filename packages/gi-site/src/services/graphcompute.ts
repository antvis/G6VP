import request from 'umi-request';
import { SERVICE_URL_PREFIX } from './const';

// 将本地数据文件导入到 GraphScope 引擎中
export const exportLocalDataToGraphScope = async params => {
  // step1: 初始化 GraphScope 引擎
  const gsResult = await request(`${SERVICE_URL_PREFIX}/graphcompute/createGSInstance`, {
    method: 'POST',
  });

  if (!gsResult || !gsResult.success) {
    return gsResult;
  }

  const { data } = gsResult;
  const { instanceId } = data;

  const {
    nodeFileList,
    edgeFileList,
    directed = true,
    nodeType,
    edgeType,
    sourceNodeType,
    targetNodeType,
    delimiter = ',',
    hasHeaderRow = true,
  } = params;
  // step2: 上传点边文件到 GraphScope 所在的服务器上
  // step2.1: 上传点文件
  const nodeFileResult = await request(`${SERVICE_URL_PREFIX}/graphcompute/uploadFile`, {
    method: 'post',
    data: {
      file: nodeFileList.file,
      instanceId,
    },
  });

  if (!nodeFileResult || !nodeFileResult.success) {
    return nodeFileResult;
  }

  const nodeFilePath = nodeFileResult.data.filePath;

  // step2.1: 上传边文件
  const edgeFileResult = await request(`${SERVICE_URL_PREFIX}/graphcompute/uploadFile`, {
    method: 'post',
    data: {
      file: edgeFileList.file,
      instanceId,
    },
  });

  if (!edgeFileResult || !edgeFileResult.success) {
    return edgeFileResult;
  }

  const edgeFilePath = edgeFileResult.data.filePath;

  // step3: 加上传的点边文件数据加载进 GraphScope 引擎
  // 构造加载的数据格式
  const loadFileParams = {
    type: 'LOCAL',
    directed,
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
      edges: [
        {
          label: edgeType,
          location: edgeFilePath,
          srcLabel: sourceNodeType,
          dstLabel: targetNodeType,
          config: {
            header_row: hasHeaderRow,
            delimiter,
          },
        },
      ],
    },
  };
  const loadResult = await request(`${SERVICE_URL_PREFIX}/graphcompute/loadData`, {
    method: 'post',
    data: loadFileParams,
  });

  if (!loadResult || !loadResult.success) {
    return loadResult;
  }

  const { graphURL, graphName, hostIp, hostName } = loadResult.data;

  // step4: 初始化 Gremlin 查询引擎
  const response = await request(`${SERVICE_URL_PREFIX}/graphcompute/initGremlinInstance`, {
    method: 'post',
    data: {
      graphURL,
    },
  });

  if (!response || !response.success) {
    return response;
  }

  return {
    success: true,
    data: {
      instanceId,
      gremlinInstance: response.data.gremlinInstance,
      loadData: {
        graphURL,
        graphName,
        hostIp,
        hostName,
      },
      edgeFile: edgeFileResult,
      nodeFile: nodeFileResult,
    },
  };
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
