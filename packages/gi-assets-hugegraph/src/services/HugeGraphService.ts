import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
export interface ConnectProps {
  httpServerURL: string;
  uri: string;
  username: string;
  password: boolean;
}

export const queryGraphSchema = async () => {
  const {
    HTTP_SERVICE_URL: httpServerURL,
    engineServerURL: uri,
    CURRENT_SUBGRAPH: graphId,
  } = utils.getServerEngineContext();
  const result = await request(`${httpServerURL}/api/hugegraph/schema`, {
    method: 'POST',
    data: {
      uri,
      graphId,
    },
  });

  return result.data;
};

export const listGraphs = async () => {
  const { engineServerURL: uri, HTTP_SERVICE_URL: httpServerURL, username, password } = utils.getServerEngineContext();
  /** TODO：localhost:8000  去访问 localhost:8080 的数据库都有跨域问题，需要 HugeGraph 团队解决下 ，暂时先用服务代理解决 */
  // try {
  //   const result = await request(`${uri}/graphs`, {
  //     method: 'GET',
  //     data: {},
  //     dataType: 'json',
  //   });
  //   console.log('lisggraphresult', result);
  //   if (result.status !== 200 || !result.data?.graphs) {
  //     return [];
  //   }
  //   return result.data.map(item => {
  //     return {
  //       label: item,
  //       value: item,
  //     };
  //   });
  // } catch (error) {
  //   console.log('errorerror', error);
  //   return [];
  // }

  const result = await request(`${httpServerURL}/api/hugegraph/graphs`, {
    method: 'POST',
    data: {
      uri,
      httpServerURL,
      username,
      password,
    },
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  if (result.status === 200) {
    return result.data.graphs.map(item => {
      return {
        label: item,
        value: item,
      };
    });
  }
};
