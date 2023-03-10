import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
export const NeighborsQuery = {
  name: '邻居查询',
  service: async params => {
    const { ids, sep } = params;
    const { HTTP_SERVICE_URL, gremlin_endpoint, GRAPHSCOPE_ACCOUNT } = utils.getServerEngineContext();

    const response = await request(`${HTTP_SERVICE_URL}/graphscope/neighbors`, {
      method: 'post',
      data: {
        id: ids,
        sep,
        gremlinServer: gremlin_endpoint,
        graphScopeAccount: GRAPHSCOPE_ACCOUNT,
      },
    });

    return response.data;
  },
};
