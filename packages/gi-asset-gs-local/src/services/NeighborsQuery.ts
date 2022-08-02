import request from 'umi-request';
import { HTTP_SERVICE_URL } from './Constants';
export const NeighborsQuery = {
  name: '邻居查询',
  service: async params => {
    const { id, sep } = params;
    const gremlinServer = localStorage.getItem('graphScopeGremlinServer');

    const response = await request(`${HTTP_SERVICE_URL}/graphcompute/neighbors`, {
      method: 'post',
      data: {
        id: [id],
        sep,
        gremlinServer,
      },
    });

    return response;
  },
};
