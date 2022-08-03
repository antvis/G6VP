import { HTTP_SERVICE_URL } from './Constants';
import request from 'umi-request';
export const ExecAlgorithm = {
  name: '执行 GraphScope 图算法',
  service: async (params = {}) => {
    const graphName = localStorage.getItem('graphScopeGraphName');

    const response = await request(`${HTTP_SERVICE_URL}/graphcompute/execAlgorithm`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        ...params,
        graphName,
      },
    });
    return response;
  },
};
