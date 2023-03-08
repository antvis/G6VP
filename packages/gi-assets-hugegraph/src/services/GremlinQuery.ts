import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
export const GremlinQuery = {
  name: 'Gremlin 查询',
  service: async (params = {}) => {
    const { value } = params as any;
    const { GI_SITE_PROJECT_ID, HTTP_SERVER_URL, gremlin_endpoint } = utils.getServerEngineContext();
    const gremlin = value.replace('g.', 'hugegraph.traversal().');
    const response = await request(`${HTTP_SERVER_URL}/gremlin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        gremlin,
        // value,
        // gremlinServer: gremlin_endpoint,
        // projectId: GI_SITE_PROJECT_ID,
      },
    });
    return response;
  },
};
