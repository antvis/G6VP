import request from 'umi-request';
import { localLoadGraphConfig } from './Constants';

export interface ConnectProps {
  engineServerURL: string;
  httpServerURL: string;
  isStringType: boolean;
}

export const connectGraphScopeService = async (params: ConnectProps) => {
  const { httpServerURL, engineServerURL, isStringType } = params;
  const result = await request(`${httpServerURL[0]}/graphcompute/connect`, {
    method: 'POST',
    data: {
      httpServerURL: httpServerURL[0],
      engineServerURL: engineServerURL[0],
      isStringType
    },
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
  const projectId = localStorage.getItem('GI_ACTIVE_PROJECT_ID');
  const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER')
  // 创建实例之前，先查找是否之前已经创建过图引擎实例
  if (currentInstance) {
    return {
      success: true,
      data: {
        instanceId: currentInstance,
      },
    };
  }

  const gsResult = await request(`${httpServerURL}/graphcompute/createGSInstance`, {
    method: 'POST',
    data: {
      projectId
    },
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
  const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER')
  const result = await request(`${httpServerURL}/graphcompute/closeGSInstance`, {
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
  const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER')

  const nodeFormData = new FormData();
  nodeFormData.append('file', fileList.file);
  nodeFormData.append('instance_id', instanceId);

  const fileResult = await request(`${httpServerURL}/graphcompute/uploadFile`, {
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
  } = params;

  const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER')
  const { directed, delimiter, hasHeaderRow } = localLoadGraphConfig

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
    instance_id: instanceId,
    dataSource: {
      nodes: nodeSources,
      edges: edgeSources,
    },
  };

  console.log('载图参数', loadFileParams);

  const loadResult = await request(`${httpServerURL}/graphcompute/loadData`, {
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
  const { dataSource } = params;
  const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER')

  const instanceResult = await createGraphScopeInstance();

  if (!instanceResult.success) {
    return instanceResult;
  }

  const { instanceId } = instanceResult.data;
  const loadFileParams = {
    type: 'LOCAL',
    directed: true,
    instance_id: instanceId,
    dataSource,
  };

  console.log('载图参数', loadFileParams);

  const loadResult = await request(`${httpServerURL}/graphcompute/loadData`, {
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
  const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER')
  const result = await request(`${httpServerURL}/graphcompute/schema`, {
    method: 'GET',
    params: {
      graphName,
    },
  });

  return result;
};

export const getGraphScopeInstances = async () => {
  const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER')
  const result = await request(`${httpServerURL}/graphcompute/instances`, {
    method: 'get',
  });

  return result;
};
