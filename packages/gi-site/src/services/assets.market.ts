// /** 临时这么引用：这部分拆分到 gi-assets 的包中，未来在云端构建 */
// import * as ComponentAssets from '@alipay/graphinsight/es/components';
// import * as ElementAssets from '@alipay/graphinsight/es/elements';

import * as giAssets from '@alipay/gi-assets';
import localforage from 'localforage';
import { dynamicLoadModules } from '../loader';
import { queryAssetList } from './assets';
import { isMock } from './const';

// TODO 临时方案，需要换成和 Component 一样的方案
let { elements } = giAssets || {};

const isDynamicLoad = false;

/**
 * 获取指定项目
 * @param id 项目id
 * @returns
 */
export const queryAssets = async (id: string, activeAssetsKeys: any) => {
  // 解压资产，获取脚本路径
  let components = {};
  // TODO: 动态加载 GI 资产，临时使用 GI 发布的资产包，需要改成从数据库中读取资产，然后按需加载
  if (isDynamicLoad) {
    const dlm = await dynamicLoadModules([
      {
        name: 'NodeLegend',
        // url: 'https://gw.alipayobjects.com/os/lib/alipay/gi-assets/0.3.1/dist/index.min.js',
        url: 'http://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/GraphInsight/test_legend-5e0ece9910fc7e3c9a7e2d228453e330.js',
      },
      {
        name: 'NodeLegend1',
        // url: 'https://gw.alipayobjects.com/os/lib/alipay/gi-assets/0.3.1/dist/index.min.js',
        url: 'http://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/GraphInsight/test_legend-5e0ece9910fc7e3c9a7e2d228453e330.js',
      },
    ]);

    // let elements = {}
    if (dlm && dlm.length > 0) {
      components = dlm.reduce((acc, curr) => {
        return {
          ...acc,
          ...curr.components,
        };
      }, {});
    }
  } else {
    // 走本地的gi-assets资产加载
    components = activeAssetsKeys.components.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: giAssets.components[curr],
      };
    }, {});

    // 走本地的gi-assets资产加载
    elements = activeAssetsKeys.elements.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: giAssets.elements[curr],
      };
    }, {});

    console.log('componentscomponentscomponents', components, elements);
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
  const ASSET_LIST = await queryAssetList({ projectId: id });

  const services = ASSET_LIST.services.map(service => {
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
