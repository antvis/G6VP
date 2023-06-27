import { utils } from '@antv/gi-sdk';
import { notification } from 'antd';
import Neo4JDriver from './Driver';
import $i18n from '../i18n';

export let Driver: Neo4JDriver | undefined;

export const connect = async () => {
  if (Driver) Driver.close();
  const { username, password, engineServerURL } = utils.getServerEngineContext();
  if (engineServerURL.startsWith('neo4j+s:')) {
    Driver = new Neo4JDriver(engineServerURL, username, password);
    const isConnect = await Driver.connect();
    console.log('isConnect', isConnect);
    if (isConnect) {
      utils.setServerEngineContext({
        ENGINE_USER_TOKEN: `Bearer ${Math.random()}`,
      });
      notification.success({
        message: $i18n.get({
          id: 'neo4j.src.services.Neo4jService.NeoJDatabaseLinkSucceeded',
          dm: 'Neo4j 数据库链接成功',
        }),
      });
      return true;
    }
    notification.error({
      message: $i18n.get({ id: 'neo4j.src.services.Neo4jService.NeoJDatabaseLinkFailed', dm: 'Neo4j 数据库链接失败' }),
      description: $i18n.get({
        id: 'neo4j.src.services.Neo4jService.CheckWhetherTheDatabaseAddress',
        dm: '请检查数据库地址，用户名，密码是否填写正确',
      }),
    });
    return false;
  } else {
    notification.error({
      message: $i18n.get({ id: 'neo4j.src.services.Neo4jService.NeoJDatabaseLinkFailed', dm: 'Neo4j 数据库链接失败' }),
      description: $i18n.get({
        id: 'neo4j.src.services.Neo4jService.TheDatabaseAddressOnlySupports',
        dm: '数据库地址仅支持 neo4j+s: 协议',
      }),
    });
    return false;
  }
};

export const getDriver = async () => {
  if (Driver) {
    return Driver;
  }
  await connect();
  return Driver;
};

export const querySubGraphList = async () => {
  const driver = await getDriver();
  if (driver) {
    const dbs = await driver.getDatabase();
    if (dbs && dbs.length > 0) {
      return dbs.map(item => {
        return {
          value: item.name,
          label: item.name,
        };
      });
    }
  }

  return [];
};

export const queryVertexLabelCount = async (graphName: string) => {
  const driver = await getDriver();
  if (driver) {
    //@ts-ignore
    const { table: nodeTable } = await driver.queryCypher(`MATCH (n)
RETURN count(n) as node_count`);
    //@ts-ignore
    const { table: edgeTable } = await driver.queryCypher(`MATCH ()-[r]->()
RETURN count(r) as relationship_count`);
    if (nodeTable && edgeTable) {
      return {
        //@ts-ignore
        nodeCount: nodeTable.rows[0],
        //@ts-ignore
        edgeCount: edgeTable.rows[0],
      };
    }
  }
  return {
    nodeCount: '-',
    edgeCount: '-',
  };
};
