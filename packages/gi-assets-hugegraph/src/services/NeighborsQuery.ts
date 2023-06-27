import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
import $i18n from '../i18n';
export const NeighborsQuery = {
  name: $i18n.get({ id: 'hugegraph.src.services.NeighborsQuery.NeighborQuery', dm: '邻居查询' }),
  service: async params => {
    const { nodes, sep, ids } = params;
    const {
      HTTP_SERVICE_URL: httpServerURL,
      engineServerURL: uri,
      CURRENT_SUBGRAPH: graphId,
    } = utils.getServerEngineContext();
    const response = await request(`${httpServerURL}/api/hugegraph/neighbors`, {
      method: 'post',
      data: {
        sourceInfos: nodes.map(node => ({
          id: node.id,
          dataType: node.nodeType,
        })),
        ids,
        sep,
        uri,
        graphId,
      },
    });

    return response.data;
  },
};
