import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
export const GremlinQuery = {
  name: 'Gremlin 查询',
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
