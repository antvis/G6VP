import { HTTP_SERVICE_URL } from './Constants';
import request from 'umi-request';

export const PropertiesPanel = {
  name: '查询元素属性',
  service: async params => {
    const id = params.id;
    const gremlinServer = localStorage.getItem('graphScopeGremlinServer');

    const response = await request(`${HTTP_SERVICE_URL}/graphcompute/properties`, {
      method: 'post',
      data: {
        id: [id],
        gremlinServer,
      },
    });

    return response;
  },
};
