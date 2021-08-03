import { GIServiceResponseData } from '../typing';
function looseJsonParse(obj) {
  return Function('"use strict";return (' + obj + ')')();
}
/**
 *
 * @param assets  服务端拿到的资产：Services
 * @param data  图数据
 * @returns
 */

export interface ServiceOpt {
  id: string;
  content: string;
  mode: string;
}

const getServicesByAssets = (assets: ServiceOpt[], data: GIServiceResponseData) => {
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
    return {
      id,
      service: fetch(content),
    };
  });
};

export default getServicesByAssets;
