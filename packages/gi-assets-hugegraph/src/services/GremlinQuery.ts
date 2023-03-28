import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
export const GremlinQuery = {
  name: 'Gremlin 查询',
  service: async (params = {}) => {
    try {
      const { value } = params as any;
      const { httpServerURL, graphId, uri } = utils.getServerEngineContext();
      console.log('hugegraphgremlin', httpServerURL, value, graphId, uri);
      const gremlin = value.replace('g.', `${graphId}.traversal().`);
      console.log('formatted', gremlin);
      const response = await request(`${httpServerURL}/api/hugegraph/gremlin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        data: {
          gremlin,
          uri,
        },
      });
      console.log('response', response);
      return response;
    } catch (error) {
      return null;
    }
  },
};
