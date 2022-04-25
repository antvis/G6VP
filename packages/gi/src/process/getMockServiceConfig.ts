export const stringify = function (obj) {
  const placeholder = '____PLACEHOLDER____';
  const fns = [];
  let json = JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'function') {
        fns.push(value as never);
        return placeholder;
      }
      return value;
    },
    2,
  );
  //@ts-ignore
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function (_) {
    return fns.shift();
  });

  return 'export default ' + json + '';
};

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
