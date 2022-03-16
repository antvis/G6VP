import request from 'umi-request';

function looseJsonParse(obj) {
  return Function('"use strict";return (' + obj + ')')();
}
const defaultTransFn = (data, params) => {
  return data;
};
/**
 *
 * @param assets  服务端拿到的资产：Services
 * @param data  图数据
 * @returns
 */
const getServicesByAssets = (assets, data) => {
  return assets.map(s => {
    const { id, content, mode } = s;
    const runtimeContent = content?.split('export default')[1] || content;
    console.log('runtime content', content, runtimeContent);

    if (mode === 'MOCK') {
      const fn = (params: any) => {
        return new Promise(async resolve => {
          try {
            const transFn = looseJsonParse(runtimeContent);
            const transData = transFn(data, params);
            return resolve(transData);
          } catch (error) {
            console.error(error);
            const transData = defaultTransFn(data, params);
            return resolve(transData);
          }
        });
      };

      return {
        id,
        service: fn,
      };
    }
    // if mode==='api'
    const service = params => {
      try {
        return request(content, {
          method: 'post',
          data: params,
        });
      } catch (error) {
        return new Promise(resolve => {
          resolve({});
        });
      }
    };
    return {
      id,
      service,
    };
  });
};

export default getServicesByAssets;
