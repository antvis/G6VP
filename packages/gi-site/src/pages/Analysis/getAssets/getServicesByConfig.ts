function looseJsonParse(obj) {
  return Function('"use strict";return (' + obj + ')')();
}

/**
 *
 * @param serviceConfig  服务端拿到的资产：Services
 * @param data  图数据
 * @returns
 */
const getServicesByConfig = (serviceConfig, LOCAL_DATA, schemaData) => {
  return serviceConfig.map(s => {
    const { id, content, mode } = s;
    const runtimeContent = content?.split('export default')[1] || content;
    try {
      const transFn = looseJsonParse(runtimeContent);
      return {
        id,
        content,
        service: (...params) => {
          return transFn(...params, LOCAL_DATA, schemaData);
        },
      };
    } catch (error) {
      return {
        id,
        content,
        service: () => {
          return new Promise(resolve => {
            resolve({
              nodes: [],
              edges: [],
            });
          });
        },
      };
    }
  });
};

export default getServicesByConfig;
