import request from 'umi-request';
export const NeighborsQuery = {
  name: '邻居查询',
  service: async params => {
    const { ids, sep } = params;

    const gremlinServer = localStorage.getItem('graphScopeGremlinServer');
    const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER');

    const response = await request(`${httpServerURL}/graphcompute/neighbors`, {
      method: 'post',
      data: {
        id: ids,
        sep,
        gremlinServer,
      },
    });

    return response.data;
  },
};
