import request from 'umi-request';
export const ExecAlgorithm = {
  name: '执行 GraphScope 图算法',
  service: async (params = {}) => {
    const graphName = localStorage.getItem('graphScopeGraphName');

    const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER');

    const response = await request(`${httpServerURL}/graphcompute/execAlgorithm`, {
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
