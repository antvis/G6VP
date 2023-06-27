import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
import $i18n from '../i18n';
export const GremlinQuery = {
  name: $i18n.get({ id: 'hugegraph.src.services.GremlinQuery.GremlinQuery', dm: 'Gremlin 查询' }),
  service: async (params = {}) => {
    try {
      const { value } = params as any;
      const {
        HTTP_SERVICE_URL: httpServerURL,
        CURRENT_SUBGRAPH: graphId,
        engineServerURL: uri,
      } = utils.getServerEngineContext();
      const gremlin = value.replace('g.', `${graphId}.traversal().`);
      const response = await request(`${httpServerURL}/api/hugegraph/gremlin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        data: {
          gremlin,
          uri,
          graphId,
        },
      });
      return response;
    } catch (error) {
      return {
        success: false,
        message: JSON.stringify(error),
      };
    }
  },
};
