import { notification } from 'antd';
import { getDriver } from './Neo4jService';
import $i18n from '../i18n';
export const CypherQuery = {
  name: $i18n.get({ id: 'neo4j.src.services.CypherQuery.NeoJCypherQuery', dm: 'Neo4j Cypher 查询' }),
  service: async (params = {}) => {
    const { value } = params as any;

    const driver = await getDriver();
    if (driver) {
      const res = await driver.queryCypher(value);
      if (!res) {
        notification.error({
          message: $i18n.get({
            id: 'neo4j.src.services.CypherQuery.FailedToExecuteCypherQuery',
            dm: '执行 Cypher 查询失败',
          }),
          description: $i18n.get(
            {
              id: 'neo4j.src.services.CypherQuery.QueryFailedRes',
              dm: '查询失败：{res}',
            },
            { res: res },
          ),
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
