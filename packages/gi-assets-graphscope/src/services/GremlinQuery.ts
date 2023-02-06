import request from 'umi-request';
export const GremlinQuery = {
  name: 'Gremlin 查询',
  service: async (params = {}) => {
    const { value } = params as any;
    const gremlinServer = 'https://gi-api.graphscope.app/gremlin'; //  localStorage.getItem('graphScopeGremlinServer');
    const projectId = localStorage.getItem('GI_ACTIVE_PROJECT_ID');
    const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER');

    const response = await request(`${httpServerURL}/graphcompute/gremlinQuery`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        value,
        gremlinServer,
        projectId,
      },
    });
    return response;
  },
};
