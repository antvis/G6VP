import { getDriver } from './Neo4jService';
export const NeighborsQuery = {
  name: '邻居查询',
  service: async params => {
    const { ids, sep } = params;
    const driver = await getDriver();
    if (driver) {
      const res = await driver.getKDegreeRelationships(ids, sep);
      return res;
    }
  },
};
