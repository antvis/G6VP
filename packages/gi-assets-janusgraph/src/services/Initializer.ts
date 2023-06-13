import { utils } from '@antv/gi-sdk';
import request from 'umi-request';

export const GI_SERVICE_INTIAL_GRAPH = {
  name: '初始化查询',
  service: async () => {
    return new Promise(resolve => {
      resolve({
        nodes: [],
        edges: [],
      });
    });
  },
};

export const GI_SERVICE_SCHEMA = {
  name: '查询图模型',
  service: async () => {
    const { ENGINE_USER_TOKEN, HTTP_SERVICE_URL, CURRENT_SUBGRAPH } = utils.getServerEngineContext();

    try {
      const result = await request(HTTP_SERVICE_URL + '/gremlin/schema', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: ENGINE_USER_TOKEN,
        },
        params: {
          graphName: CURRENT_SUBGRAPH,
        },
      });
      const { success, data } = result;

      if (success) {
        return data;
      }
      return {
        nodes: [],
        edges: [],
      };
    } catch (error) {
      console.error('error', error);
      return {
        nodes: [],
        edges: [],
      };
    }
  },
};
