import request from 'umi-request';
import { HTTP_SERVICE_URL } from './Constants';

export interface ConnectProps {
  engineServerURL: string;
  httpServerURL: string;
  isStringType: boolean;
}

export const connectGraphScopeService = async (params: ConnectProps) => {
  const { httpServerURL } = params;
  const result = await request(`${httpServerURL}/graphcompute/connect`, {
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (result.success) {
    const { httpServerURL } = result.data;
    localStorage.setItem('GRAPHSCOPE_HTTP_SERVER', httpServerURL);
  }

  return result;
};

export const createGraphScopeInstance = async () => {
  const currentInstance = localStorage.getItem('GI_CURRENT_GRAPHSCOPE_INSTANCE');

  // 创建实例之前，先查找是否之前已经创建过图引擎实例
  if (currentInstance) {
    return {
      success: true,
      data: {
        instanceId: currentInstance,
      },
    };
  }

  const gsResult = await request(`${HTTP_SERVICE_URL}/graphcompute/createGSInstance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!gsResult || !gsResult.success) {
    return gsResult;
  }

  const { data } = gsResult;
  const { instanceId: newInstanceId } = data;

  localStorage.setItem('GI_CURRENT_GRAPHSCOPE_INSTANCE', newInstanceId);
  return gsResult;
};

export const closeGraphInstance = async () => {
  const currentInstance = localStorage.getItem('GI_CURRENT_GRAPHSCOPE_INSTANCE');

  const result = await request(`${HTTP_SERVICE_URL}/graphcompute/closeGSInstance`, {
    method: 'GET',
    params: {
      instanceId: currentInstance,
    },
  });

  localStorage.removeItem('GI_CURRENT_GRAPHSCOPE_INSTANCE');
  localStorage.removeItem('graphScopeGremlinServer');
  localStorage.removeItem('graphScopeGraphName');

  return result;
};

export const uploadLocalFileToGraphScope = async params => {
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
};

export const loadGraphToGraphScope = async params => {
  const {
    nodeConfigList,
    edgeConfigList,
    fileMapping,
    isStringType,
    directed = true,
    delimiter = ',',
    hasHeaderRow = true,
  } = params;

  const instanceResult = await createGraphScopeInstance();

  if (!instanceResult.success) {
    return;
  }

  const { instanceId } = instanceResult.data;

  // 构造载图时的 nodes 对象
  const nodeSources = nodeConfigList
    .filter(d => {
      // nodeType 必须存在

      // nodeFileList 必须存在，
      const { nodeType, nodeFileList } = d;

      // filePath 必须存在
      const filePath = fileMapping[nodeFileList?.file?.name];

      return nodeType && filePath;
    })
    .map(d => {
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

  const edgeSources = edgeConfigList
    .filter(d => {
      // edgeType source target 都必须存在
      const { edgeType, edgeFileList, sourceNodeType, targetNodeType } = d;
      const filePath = fileMapping[edgeFileList?.file?.name];
      return edgeType && filePath && sourceNodeType && targetNodeType;
    })
    .map(d => {
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

  localStorage.setItem('graphScopeGremlinServer', graphURL);
  localStorage.setItem('graphScopeGraphName', graphName);

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

export const loadChinaVisGraphToGraphScope = async params => {
  // const context =  localStorage.getItem("GS_SERVER_CONTEXT");

  const { dataSource } = params;

  const instanceResult = await createGraphScopeInstance();

  if (!instanceResult.success) {
    return instanceResult;
  }

  const { instanceId } = instanceResult.data;
  const loadFileParams = {
    type: 'LOCAL',
    directed: true,
    oid_type: 'string',
    instance_id: instanceId,
    dataSource,
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

  localStorage.setItem('graphScopeGremlinServer', graphURL);
  localStorage.setItem('graphScopeGraphName', graphName);

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

export const loadDefaultGraphToGraphScope = async params => {
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

  const instanceResult = await createGraphScopeInstance();

  if (!instanceResult.success) {
    return;
  }

  const { instanceId } = instanceResult.data;

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

  localStorage.setItem('graphScopeGremlinServer', graphURL);
  localStorage.setItem('graphScopeGraphName', graphName);

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

export const queryGraphSchema = async () => {
  const graphName = localStorage.getItem('graphScopeGraphName') as string;

  const result = await request(`${HTTP_SERVICE_URL}/graphcompute/schema`, {
    method: 'GET',
    params: {
      graphName,
    },
  });

  return result;
};

export const getGraphScopeInstances = async () => {
  const result = await request(`${HTTP_SERVICE_URL}/graphcompute/instances`, {
    method: 'get',
  });

  return result;
};
