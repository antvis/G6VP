import { utils } from '@antv/gi-sdk';
import request from 'umi-request';

export const PropertiesPanel = {
  name: '查询元素属性',
  service: async params => {
    const { id, type = 'node' } = params;
    const { HTTP_SERVICE_URL, gremlin_endpoint, GRAPHSCOPE_ACCOUNT } = utils.getServerEngineContext();

    const response = await request(`${HTTP_SERVICE_URL}/graphscope/properties`, {
      method: 'post',
      data: {
        id: [id],
        type,
        gremlinServer: gremlin_endpoint,
        graphScopeAccount: GRAPHSCOPE_ACCOUNT,
      },
    });

    return response;
  },
};
