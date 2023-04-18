import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
import NodeRSA from 'node-rsa'
import qs from 'qs'
//rsa加密
export const encryp = password => {
    //公钥
    var PUBLIC_KEY =
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXgctF+noMbOXv5c8hVef4vE6eK/mwnzEpMoHpZJjphuyTcowsD9DBWe+PrqZOEm1PomzD/TxOn9eMhn9O+w3yuuv8fipMs6OjU6Y+rKLrGJ8aCZpzd7Y5eewQS/0hOGmWtQlLdayJaUT0B0Fpz3yhR7u7vtVhKwbCYYfHxhg1PQIDAQAB'
    //使用公钥加密
    var encrypt = new NodeRSA('-----BEGIN PUBLIC KEY-----' + PUBLIC_KEY + '-----END PUBLIC KEY-----')
    encrypt.setOptions({encryptionScheme: 'pkcs1'})
    var encrypted = encrypt.encrypt(password,'base64')
    return encrypted
}


export const connectGalaxybaseDataSource = async () => {
  const { username, password, HTTP_SERVICE_URL } = utils.getServerEngineContext();
  const result = await request(`${HTTP_SERVICE_URL}/api/login`, {
    method: 'POST',
    data: qs.stringify({
      username,
      password:encryp(password),
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Accept: 'application/json,text/plain,*/*',
    },
  }).catch(error => {});

  if (!result || !result.success) {
    return null;
  }
  const { data } = result;
  utils.setServerEngineContext({
    GALAXYBASE_USER_TOKEN: data.token,
  });
  return result;
};

export const querySubGraphList = async () => {
  const { GALAXYBASE_USER_TOKEN, HTTP_SERVICE_URL } = utils.getServerEngineContext();

  const result = await request(`${HTTP_SERVICE_URL}/api/auth/graph/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Authorization: GALAXYBASE_USER_TOKEN,
    },
  });
  
  return result;
};

export const queryVertexLabelCount = async (graphName: string) => {
  const { GALAXYBASE_USER_TOKEN, HTTP_SERVICE_URL } = utils.getServerEngineContext();

  const result = await request(`${HTTP_SERVICE_URL}/api/graph/count`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: GALAXYBASE_USER_TOKEN,
    },
    params: {
      graphName,
    },
  });

  return result;
};

export const queryGraphSchema = async params => {
  const { GALAXYBASE_USER_TOKEN, HTTP_SERVICE_URL } = utils.getServerEngineContext();

  let res = {
    nodes: [],
    edges: [],
  };
  const { graphName } = (params as any) || {};

  if (!GALAXYBASE_USER_TOKEN) {
    // 没有登录信息，需要先登录再查询 schema
    return {
      success: false,
      nodes: [],
      edges: [],
      code: 500,
      message: `图模型查询失败: 没有获取到连接 Galaxybase 数据库的 Token 信息，请先连接 Galaxybase 数据库再进行尝试！`,
    };
  }

  try {
    const result = await request(HTTP_SERVICE_URL + '/api/buildGraph/getSchema', {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Authorization: GALAXYBASE_USER_TOKEN,
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
