import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
export const NeighborsQuery = {
  name: '邻居查询',
  service: async params => {
    const { ids, sep } = params;
    const { httpServerURL } = utils.getServerEngineContext();
    const response = await request(`${httpServerURL}/api/hugegraph/neighbors`, {
      method: 'post',
      data: {
        ids,
        sep,
      },
    });

    return response.data;
  },
};
