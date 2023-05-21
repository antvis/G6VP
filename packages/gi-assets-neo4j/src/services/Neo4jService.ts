import { utils } from '@antv/gi-sdk';
import Neo4JDriver from './Driver';

export let Driver: Neo4JDriver | undefined;

export const connect = async () => {
  if (Driver) Driver.close();
  const { username, password, engineServerURL } = utils.getServerEngineContext();
  Driver = new Neo4JDriver(engineServerURL, username, password);
  const isConnect = await Driver.connect();
  console.log('isConnect', isConnect);
  if (isConnect) {
    utils.setServerEngineContext({
      ENGINE_USER_TOKEN: `Bearer ${Math.random()}`,
    });
  }
  return isConnect;
};

export const getDriver = async () => {
  if (Driver) {
    return Driver;
  }
  await connect();
  return Driver;
};

export const querySubGraphList = async () => {
  console.log('dbs', Driver);
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
  return {};
};
