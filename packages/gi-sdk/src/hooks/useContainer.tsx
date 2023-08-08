import React from 'react';
import type { IGIAC, TGIAC_CONTENT } from '../components/const';
import { TYPE } from '../constants/info';
export interface AssetComponet {
  icon: string;
  id: string;
  info: TYPE;
  props: {
    GIAC_CONTENT: TGIAC_CONTENT;
    GIAC: IGIAC;
    [key: string]: any;
  };
  component: React.FunctionComponent;
}
export interface Container {
  /** 容器中资产ID */
  GI_CONTAINER: string[];
  /** 容器中资产的具体实现 */
  components: AssetComponet[];
  /** 容器ID */
  id: string;
  /** 容器名称 */
  name: string;
  /** 是否展示 */
  display: boolean;
  /** 是否启用配置 */
  require: boolean;
  /** 其他配置参数 */
  [key: string]: any;
}

const compatibleContainers = containers => {
  /**
   * hack start
   *
   * 不应该修改 registerMeta 原有的containers 数据结构
   * 1. 先把追加的 GI_FreeContainer 移除
   * 2. 把 GI_CONTAINER 中的 数组对象 改为字符串,有的时候，修改容器内容，又会变成string
   *
   * TODO：
   * 需要在gi-site层修改这个containers的值
   *
   */
  return containers
    .filter(item => {
      if (item.id === 'GI_FreeContainer') {
        return false;
      }
      return true;
    })
    .map(item => {
      return {
        ...item,
        GI_CONTAINER: item.GI_CONTAINER.map(item => {
          if (item.value) {
            return item.value;
          }
          return item;
        }),
      };
    });
  /** hack end */
};

/**
 * 获取根据容器资产配置，获取容器内资产实例
 *
 * @param context GISDK 上下文
 * @param containers 容器资产 props.containers
 * @returns
 */
const useContainer = (context, _containers?: any): Container[] => {
  const { assets, config } = context;
  const { pageLayout } = config;
  const containers = compatibleContainers(pageLayout.props.containers);
  const ComponentCfgMap = config.components.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr,
    };
  }, {});
  const getComponentById = (componentId: string) => {
    if (!componentId) {
      return null;
    }
    const asset = assets.components[componentId];
    const assetConfig = ComponentCfgMap[componentId];
    if (!asset || !assetConfig) {
      console.warn(`asset: ${componentId} not found`);
      return null;
    }
    const { icon } = assetConfig.props?.GIAC_CONTENT || asset.info;
    return {
      icon,
      id: componentId,
      info: asset.info,
      props: assetConfig.props,
      component: asset.component,
    };
  };

  return React.useMemo(() => {
    return containers.map(container => {
      const components = container.GI_CONTAINER.map(getComponentById).filter(c => c);
      return {
        ...container,
        components,
      };
    });
  }, [ComponentCfgMap, assets]);
};

export default useContainer;
