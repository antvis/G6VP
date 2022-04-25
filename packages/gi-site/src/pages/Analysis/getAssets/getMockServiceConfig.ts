import { stringify } from './utils';

/**
 *
 * @param componentAssets 服务端拿到的资产: Components
 * @param data 图数据
 * @returns
 */
const getMockServiceConfig = componentAssets => {
  return Object.keys(componentAssets)
    .map(key => {
      const component = componentAssets[key];
      if (!component) {
        return [];
      }
      const { mockServices } = component;
      if (mockServices) {
        const sers = mockServices();
        return sers.map(c => {
          return {
            id: c.id,
            mode: 'MOCK',
            name: c.name || c.id,
            content: stringify(c.service),
          };
        });
      }
      return [];
    })
    .reduce((acc, curr) => {
      return [...acc, ...curr];
    }, [])
    .filter(c => {
      return c;
    });
};
export default getMockServiceConfig;
