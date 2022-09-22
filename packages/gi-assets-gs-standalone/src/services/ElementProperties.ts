import request from 'umi-request';

export const PropertiesPanel = {
  name: '查询元素属性',
  service: async params => {
    const id = params.id;
    const gremlinServer = localStorage.getItem('graphScopeGremlinServer');
    const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER');

    const response = await request(`${httpServerURL}/graphcompute/properties`, {
      method: 'post',
      data: {
        id: [id],
        gremlinServer,
      },
    });

    return response;
  },
};
