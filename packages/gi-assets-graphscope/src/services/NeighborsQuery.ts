import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
export const NeighborsQuery = {
  name: '邻居查询',
  service: async params => {
    const { ids, sep } = params;
    const { GRAPHSCOPE_ACCOUNT } = utils.getServerEngineContext();

    const gremlinServer = localStorage.getItem('graphScopeGremlinServer');
    const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER');

    const response = await request(`${httpServerURL}/graphscope/neighbors`, {
      method: 'post',
      data: {
        id: ids,
        sep,
        gremlinServer,
        graphScopeAccount: GRAPHSCOPE_ACCOUNT,
      },
    });

    return response.data;
  },
};
