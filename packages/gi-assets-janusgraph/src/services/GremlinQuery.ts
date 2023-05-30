import { utils } from '@antv/gi-sdk';
import request from 'umi-request';

export const GremlinQuery = {
  name: 'Gremlin Cypher 查询',
  service: async ({ value }) => {
    const { HTTP_SERVICE_URL, engineServerURL } = utils.getServerEngineContext();

    const response = await request(`${HTTP_SERVICE_URL}/gremlin/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        engineServerURL,
        httpServerURL: HTTP_SERVICE_URL,
        value,
      },
    }).catch(err => {
      console.log(err);
      return {
        data: {},
        success: false,
        message: err,
      };
    });
    return response;
  },
};
