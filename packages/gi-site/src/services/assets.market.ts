// /** 临时这么引用：这部分拆分到 gi-assets 的包中，未来在云端构建 */
// import * as ComponentAssets from '@alipay/graphinsight/es/components';
// import * as ElementAssets from '@alipay/graphinsight/es/elements';

import * as giAssets from '@alipay/gi-assets';
import localforage from 'localforage';
import { dynamicLoadModules, getCombinedAssets } from '../loader';
import { queryActiveAssetList, queryAssetList } from './assets';
import { isMock, IS_DYNAMIC_LOAD } from './const';

let { elements, layouts } = (giAssets || {}) as any;

if (IS_DYNAMIC_LOAD) {
  elements = {};
  layouts = {};
}

/**
 * 获取指定项目
 * @param id 项目id
 * @returns
 */
export const queryAssets = async (id: string, activeAssetsKeys: any) => {
  // 解压资产，获取脚本路径
  let components = {};

  if (IS_DYNAMIC_LOAD) {
    const { components: activeComponentKeys, elements: activeElementKeys } = activeAssetsKeys;

    const assetKeys = [...activeComponentKeys, ...activeElementKeys, 'My_Legend', 'Rect_Node', 'GraphinEdge'];
    if (assetKeys.length === 0) {
      return await new Promise(resolve => {
        resolve({
          components: [],
          services: [],
          elements: [],
        });
      });
    }
    const param = assetKeys.map(d => {
      return {
        name: d,
        version: 'sprint_test_legend_zwcenscc83e_20211023',
      };
    });

    // const param = [
    //   {
    //     name: 'My_Legend',
    //     version: 'sprint_My_Legend_8cnsk9bys1_20211028',
    //   },
    //   {
    //     name: 'test_legend',
    //     version: 'sprint_test_legend_zwcenscc83e_20211023'
    //   },
    //   {
    //     name: 'Rect_Node',
    //     version: 'sprint_Rect_Node_o2iudy9w1m_20211028'
    //   }
    // ]

    const activeAssetList = await queryActiveAssetList(param);

    if (!activeAssetList || !activeAssetList.success) {
      console.error(`接口请求错误，错误原因：${activeAssetList.errorMsg}`);
      return;
    }

    const dynamicParam = activeAssetList.data.map(d => {
      return {
        name: d.name,
        url: d.distCodeUrl,
        type: d.type,
      };
    });

    const dlm = await dynamicLoadModules(dynamicParam);

    if (dlm && dlm.length > 0) {
      const componentModules = dlm.filter(d => d.type === 1);
      const elementModules = dlm.filter(d => {
        return d.type === 4 || d.type === 5;
      });
      components = componentModules.reduce((acc, curr) => {
        const currentComponent = curr.components.default;
        const { info } = currentComponent;
        return {
          ...acc,
          [info.id]: currentComponent,
        };
      }, {});

      elements = elementModules.reduce((acc, curr) => {
        const currentElement = curr.components.default;
        const { info } = currentElement;
        return {
          ...acc,
          [info.id]: currentElement,
        };
      }, {});
    }
  } else {
    // 走本地的gi-assets资产加载

    const dlm = await dynamicLoadModules();
    const FinalAssets = getCombinedAssets();
    components = activeAssetsKeys.components.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: FinalAssets.components[curr],
      };
    }, {});

    // 走本地的gi-assets资产加载
    elements = activeAssetsKeys.elements.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: FinalAssets.elements[curr],
      };
    }, {});

    layouts = activeAssetsKeys.layouts.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: FinalAssets.layouts[curr],
      };
    }, {});
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
    const serviceId = name.indexOf('GI_SERVICE_INTIAL_GRAPH') !== -1 ? 'GI_SERVICE_INTIAL_GRAPH' : name;

    return {
      id: serviceId,
      content: sourceCode?.split('export default')[1] || ``,
      mode: 'MOCK',
      name: displayName,
      others: service,
    };
  });

  return await new Promise(resolve => {
    resolve({
      components,
      services,
      elements,
      layouts,
    });
  });
};
