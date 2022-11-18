import { notification } from 'antd';
import request from 'umi-request';
import { HTTP_SERVICE_URL } from './Constants';

export const CypherQuery = {
  name: '图语句查询',
  service: async (params = {}) => {
    const { value } = params as any;
    const token = localStorage.getItem('TUGRAPH_USER_TOKEN') as string;
    const graphName = localStorage.getItem('CURRENT_TUGRAPH_SUBGRAPH') || 'default';

    const response = await request(`${HTTP_SERVICE_URL}/api/tugraph/languagequery`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: token,
      },
      data: {
        value,
        graphName,
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

    return data;
  },
};
