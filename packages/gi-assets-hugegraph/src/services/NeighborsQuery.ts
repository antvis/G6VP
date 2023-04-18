import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
export const NeighborsQuery = {
  name: '邻居查询',
  service: async params => {
    const { nodes, sep, ids } = params;
    const { httpServerURL, uri, graphId } = utils.getServerEngineContext();
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
