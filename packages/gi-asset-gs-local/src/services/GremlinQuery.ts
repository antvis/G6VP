import { HTTP_SERVICE_URL } from './Constants';
import request from 'umi-request';
export const GremlinQuery = {
  name: 'Gremlin 查询',
  service: async (params = {}) => {
    const { value } = params as any;
    const gremlinServer = localStorage.getItem('graphScopeGremlinServer');

    const response = await request(`${HTTP_SERVICE_URL}/graphcompute/gremlinQuery`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        value,
        gremlinServer,
      },
    });
    return response;
  },
};
