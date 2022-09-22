import request from 'umi-request';
export const NeighborsQuery = {
  name: '邻居查询',
  service: async params => {
    const { id, sep } = params;
    const gremlinServer = localStorage.getItem('graphScopeGremlinServer');
    const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER');

    const response = await request(`${httpServerURL}/graphcompute/neighbors`, {
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
