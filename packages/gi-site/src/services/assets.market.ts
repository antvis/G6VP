// /** 临时这么引用：这部分拆分到 gi-assets 的包中，未来在云端构建 */
// import * as ComponentAssets from '@alipay/graphinsight/es/components';
// import * as ElementAssets from '@alipay/graphinsight/es/elements';

// import giAssets from '@alipay/gi-assets';
import localforage from 'localforage';
import { queryAssetList } from './assets';
import { isMock } from './const';
import { dynamicLoadModules } from '../loader'
// const { components: GiComponents, elements } = giAssets;

/** 临时方案：第三方组件库的图资产 */
// const GeaMakerComponents = {};

// const components = {
//   ...GiComponents,
//   ...GeaMakerComponents,
// };

/** 临时这么引用：这部分拆分到 gi-assets 的包中，未来在云端构建 */

/**
 * 获取指定项目
 * @param id 项目id
 * @returns
 */
export const queryAssets = async (id: string) => {
  // TODO: 动态加载 GI 资产，临时使用 GI 发布的资产包，需要改成从数据库中读取资产，然后按需加载
  const dlm = await dynamicLoadModules([
    {
      name: 'GIAssets',
      url: 'https://gw.alipayobjects.com/os/lib/alipay/gi-assets/0.3.1/dist/index.min.js'
    }
  ])
  let components = {}
  let elements = {}
  if (dlm && dlm.length > 0) {
    components = dlm[0]?.components?.default?.components
    elements = dlm[0]?.components?.default?.elements
  }
  
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
      console.log('%c service!!', service);
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
