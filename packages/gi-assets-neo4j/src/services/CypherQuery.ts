import { notification } from 'antd';
import { getDriver } from './Neo4jService';
export const CypherQuery = {
  name: 'Neo4j Cypher 查询',
  service: async (params = {}) => {
    const { value } = params as any;

    const driver = await getDriver();
    if (driver) {
      const res = await driver.queryCypher(value);
      if (!res) {
        notification.error({
          message: '执行 Cypher 查询失败',
          description: `查询失败：${res}`,
        });
      }
      return res;
    }
    return {
      nodes: [],
      edges: [],
    };
  },
};
