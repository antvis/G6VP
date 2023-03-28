import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
export const NeighborsQuery = {
  name: '邻居查询',
  service: async params => {
    const { nodes, sep } = params;
    const { httpServerURL, uri } = utils.getServerEngineContext();
    const response = await request(`${httpServerURL}/api/hugegraph/neighbors`, {
      method: 'post',
      data: {
        sourceInfos: nodes.map(node => ({
          id: node.id,
          dataType: node.nodeType,
        })),
        sep,
        uri,
      },
    });

    return response.data;
  },
};
