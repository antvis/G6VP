import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
import $i18n from '../i18n';
export const GremlinQuery = {
  name: $i18n.get({ id: 'graphscope.src.services.GremlinQuery.GremlinQuery', dm: 'Gremlin 查询' }),
  service: async (params = {}) => {
    const { value } = params as any;
    const { GI_SITE_PROJECT_ID, HTTP_SERVICE_URL, gremlin_endpoint, GRAPHSCOPE_ACCOUNT } =
      utils.getServerEngineContext();
    const response = await request(`${HTTP_SERVICE_URL}/graphscope/gremlinQuery`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        value,
        gremlinServer: gremlin_endpoint,
        projectId: GI_SITE_PROJECT_ID,
        graphScopeAccount: GRAPHSCOPE_ACCOUNT,
      },
    });
    return response;
  },
};
