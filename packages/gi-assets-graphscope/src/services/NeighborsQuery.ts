import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
import $i18n from '../i18n';
export const NeighborsQuery = {
  name: $i18n.get({ id: 'graphscope.src.services.NeighborsQuery.NeighborQuery', dm: '邻居查询' }),
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
