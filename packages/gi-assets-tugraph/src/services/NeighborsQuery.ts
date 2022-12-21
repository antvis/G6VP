import { utils } from '@antv/gi-sdk';
import request from 'umi-request';

export const NeighborsQuery = {
  name: '邻居查询',
  service: async params => {
    const { TUGRAPH_USER_TOKEN, HTTP_SERVICE_URL } = utils.getServerEngineContext();
    const { ids, sep, graphName } = params;
    const response = await request(`${HTTP_SERVICE_URL}/api/tugraph/neighbors`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: TUGRAPH_USER_TOKEN,
      },
      data: {
        ids,
        sep,
        graphName,
      },
    });

    return response.data;
  },
};
