function looseJsonParse(obj) {
  return Function('"use strict";return (' + obj + ')')();
}

/**
 *
 * @param serviceConfig  服务端拿到的资产：Services
 * @param data  图数据
 * @returns
 */
const getServicesByConfig = (serviceConfig, LOCAL_DATA) => {
  return serviceConfig.map(s => {
    const { id, content, mode } = s;
    const runtimeContent = content?.split('export default')[1] || content;

    const transFn = looseJsonParse(runtimeContent);
    console.log('runtime content', content, runtimeContent, {
      id,
      service: (...params) => {
        return transFn(...params, LOCAL_DATA);
      },
    });
    return {
      id,
      service: (...params) => {
        return transFn(...params, LOCAL_DATA);
      },
    };
  });
};

export default getServicesByConfig;
