import { utils } from '@antv/gi-sdk';
import { message } from 'antd';

import { getDriver } from './Neo4jService';
import $i18n from '../i18n';

export const GI_SERVICE_INTIAL_GRAPH = {
  name: $i18n.get({ id: 'neo4j.src.services.Initializer.InitializeAQuery', dm: '初始化查询' }),
  service: async () => {
    return new Promise(resolve => {
      resolve({
        nodes: [],
        edges: [],
      });
    });
  },
};

export const GI_SERVICE_SCHEMA = {
  name: $i18n.get({ id: 'neo4j.src.services.Initializer.QueryGraphModel', dm: '查询图模型' }),
  service: async () => {
    const { CURRENT_SUBGRAPH, ENGINE_USER_TOKEN } = utils.getServerEngineContext();
    if (!ENGINE_USER_TOKEN) {
      message.error(
        $i18n.get({
          id: 'neo4j.src.services.Initializer.NeoJDataSourceConnection',
          dm: 'Neo4j 数据源连接失败: 没有获取到连接 Neo4j 数据库的连接信息，请先连接 Neo4j 数据库再进行尝试！',
        }),
      );
      return;
    }
    try {
      const driver = await getDriver();
      if (driver) {
        const schema = await driver.getSchema(CURRENT_SUBGRAPH);
        return schema;
      }
      return {
        nodes: [],
        edges: [],
      };
    } catch (error) {
      console.log('error', error);
      return {
        nodes: [],
        edges: [],
      };
    }
  },
};
