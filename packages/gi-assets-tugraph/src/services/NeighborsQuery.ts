import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
import $i18n from '../i18n';

export const NeighborsQuery = {
  name: $i18n.get({ id: 'tugraph.src.services.NeighborsQuery.NeighborQuery', dm: '邻居查询' }),
  service: async params => {
    const { ENGINE_USER_TOKEN, HTTP_SERVICE_URL, CURRENT_SUBGRAPH } = utils.getServerEngineContext();
    const { ids, sep, limit } = params;
    const response = await request(`${HTTP_SERVICE_URL}/api/tugraph/neighbors`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: ENGINE_USER_TOKEN,
      },
      data: {
        ids,
        sep,
        graphName: CURRENT_SUBGRAPH,
        limit,
      },
    });

    return response.data;
  },
};
