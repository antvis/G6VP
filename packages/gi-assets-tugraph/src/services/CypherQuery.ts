import { utils } from '@antv/gi-sdk';
import { notification } from 'antd';
import request from 'umi-request';

export const CypherQuery = {
  name: '图语句查询',
  service: async (params = {}) => {
    const { value, limit } = params as any;
    const { TUGRAPH_USER_TOKEN, CURRENT_TUGRAPH_SUBGRAPH, HTTP_SERVICE_URL } = utils.getServerEngineContext();

    // const graphName = localStorage.getItem('CURRENT_TUGRAPH_SUBGRAPH') || 'default';

    const response = await request(`${HTTP_SERVICE_URL}/api/tugraph/languagequery`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: TUGRAPH_USER_TOKEN,
      },
      data: {
        value,
        graphName: CURRENT_TUGRAPH_SUBGRAPH,
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
    if (data.code === 401) {
      notification.error({
        message: '引擎认证失败：请检查数据集',
        description: data.data.error_message,
      });
      return {
        nodes: [],
        edges: [],
      };
    }

    return data;
  },
};
