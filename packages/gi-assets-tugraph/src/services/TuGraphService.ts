import { utils } from '@antv/gi-sdk';
import request from 'umi-request';

export const connectTuGraphDataSource = async () => {
  const { username, password, engineServerURL, HTTP_SERVICE_URL } = utils.getServerEngineContext();
  const result = await request(`${HTTP_SERVICE_URL}/api/tugraph/connect`, {
    method: 'POST',
    data: {
      username,
      password,
      serverUrl: engineServerURL,
    },
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: 'application/json; charset=UTF-8',
    },
  }).catch(error => {});

  if (!result || !result.success) {
    return result;
  }

  const { data } = result;
  utils.setServerEngineContext({
    TUGRAPH_USER_TOKEN: `Bearer ${data.jwt}`,
  });
  return result;
};

export const querySubGraphList = async () => {
  const { TUGRAPH_USER_TOKEN, HTTP_SERVICE_URL } = utils.getServerEngineContext();

  const result = await request(`${HTTP_SERVICE_URL}/api/tugraph/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: TUGRAPH_USER_TOKEN,
    },
  });

  return result;
};

export const queryVertexLabelCount = async (graphName: string) => {
  const { TUGRAPH_USER_TOKEN, HTTP_SERVICE_URL } = utils.getServerEngineContext();

  const result = await request(`${HTTP_SERVICE_URL}/api/tugraph/count`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: TUGRAPH_USER_TOKEN,
    },
    params: {
      graphName,
    },
  });

  return result;
};

export const queryGraphSchema = async params => {
  const { TUGRAPH_USER_TOKEN, HTTP_SERVICE_URL } = utils.getServerEngineContext();

  let res = {
    nodes: [],
    edges: [],
  };
  const { graphName } = (params as any) || {};

  if (!TUGRAPH_USER_TOKEN) {
    // 没有登录信息，需要先登录再查询 schema
    return {
      success: false,
      nodes: [],
      edges: [],
      code: 500,
      message: `图模型查询失败: 没有获取到连接 TuGraph 数据库的 Token 信息，请先连接 TuGraph 数据库再进行尝试！`,
    };
  }

  try {
    const result = await request(HTTP_SERVICE_URL + '/api/tugraph/schema', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: TUGRAPH_USER_TOKEN,
      },
      params: {
        graphName,
      },
    });
    if (result.success) {
      res = result.data;
    }
    return res;
  } catch (e) {
    return {
      success: false,
      code: 500,
      message: `图模型查询失败: ${e}`,
      nodes: [],
      edges: [],
    };
  }
};
