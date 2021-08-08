function looseJsonParse(obj) {
  return Function('"use strict";return (' + obj + ')')();
}
/**
 *
 * @param assets  服务端拿到的资产：Services
 * @param data  图数据
 * @returns
 */
const getServicesByAssets = (assets, data) => {
  let res = data;
  return assets.map(s => {
    const { id, content, mode } = s;
    if (mode === 'mock') {
      const service = new Promise(async resolve => {
        let transFn = opt => {
          return opt;
        };
        try {
          transFn = looseJsonParse(content);
          if (transFn) {
            res = transFn(res);
          }
        } catch (error) {
          console.error(error);
        }
        return resolve(res);
      });
      return {
        id,
        service,
      };
    }
    // if mode==='api'
    try {
      return {
        id,
        service: fetch(content),
      };
    } catch (error) {
      console.error(error);
      return {
        id,
        service: {},
      };
    }
  });
};

export default getServicesByAssets;
