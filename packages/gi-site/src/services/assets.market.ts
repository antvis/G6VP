// /** 临时这么引用：这部分拆分到 gi-assets 的包中，未来在云端构建 */
// import * as ComponentAssets from '@alipay/graphinsight/es/components';
// import * as ElementAssets from '@alipay/graphinsight/es/elements';
import assets from '@alipay/gi-assets';
import localforage from 'localforage';
import { queryAssetList } from './assets';
import { isMock } from './const';
const { components, elements } = assets;
/** 临时这么引用：这部分拆分到 gi-assets 的包中，未来在云端构建 */

/**
 * 获取指定项目
 * @param id 项目id
 * @returns
 */
export const queryAssets = async (id: string) => {
  if (isMock) {
    const { serviceConfig } = await localforage.getItem(id);
    return await new Promise(resolve => {
      resolve({
        services: JSON.parse(serviceConfig),
        components: components,
        elements: elements,
      });
    });
  }
  const result = await queryAssetList();
  const { data, success } = result;
  if (!success) {
    return {};
  }
  const services = data
    .filter(d => d.type === 3 && d.projectId === id)
    .map(service => {
      const { name, sourceCode, displayName } = service;
      const serviceId = name.indexOf('GI_SERVICE_INTIAL_GRAPH') !== -1 ? 'GI_SERVICE_INTIAL_GRAPH' : name;

      return {
        id: serviceId,
        content: sourceCode?.split('export default')[1] || ``,
        mode: 'mock',
        name: displayName,
        others: service,
      };
    });

  return await new Promise(resolve => {
    resolve({
      components,
      services,
      elements,
    });
  });
};
