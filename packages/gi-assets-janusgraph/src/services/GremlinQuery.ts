import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
import $i18n from '../i18n';

export const GremlinQuery = {
  name: $i18n.get({ id: 'janusgraph.src.services.GremlinQuery.GremlinCypherQuery', dm: 'Gremlin Cypher 查询' }),
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
