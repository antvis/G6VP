import { utils } from '@antv/gi-sdk';
import { notification } from 'antd';
import request from 'umi-request';
import { refreshToken } from './TuGraphService';
export const CypherQuery = {
  name: '图语句查询',
  service: async (params = {}) => {
    const { value, limit } = params as any;
    const { ENGINE_USER_TOKEN, CURRENT_SUBGRAPH, HTTP_SERVICE_URL } = utils.getServerEngineContext();

    // const graphName = localStorage.getItem('CURRENT_SUBGRAPH') || 'default';

    const response = await request(`${HTTP_SERVICE_URL}/api/tugraph/languagequery`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: ENGINE_USER_TOKEN,
      },
      data: {
        value,
        graphName: CURRENT_SUBGRAPH,
        limit,
      },
    });
    const { data, success, message } = response;
    if (!success) {
      notification.error({
        message: '执行 Cypher 查询失败',
        description: `查询失败：${message}`,
      });
      return {
        nodes: [],
        edges: [],
      };
    }
    if (data.error_message) {
      refreshToken();
      return {
        nodes: [],
        edges: [],
      };
    }

    return data;
  },
};
