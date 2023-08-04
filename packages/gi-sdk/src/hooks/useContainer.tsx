import { Empty } from 'antd';
import React from 'react';

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
  return containers.slice(0, -1).map(item => {
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
const useContainer = (context, _containers?: any) => {
  const { assets, config } = context;
  const { pageLayout } = config;
  const containers = compatibleContainers(pageLayout.props.containers);
  const ComponentCfgMap = config.components.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr,
    };
  }, {});
  const getComponentById = componentId => {
    const asset = assets.components[componentId];
    const assetConfig = ComponentCfgMap[componentId];
    if (!asset || !assetConfig) {
      console.warn(`asset: ${componentId} not found`);
      return null;
    }
    const { component: Component } = asset;
    const { props: componentProps } = assetConfig;
    const { icon } = componentProps.GIAC_CONTENT || {};
    return {
      id: componentId,
      icon,
      props: componentProps,
      component: <Component {...componentProps} />,
    };
  };

  return React.useMemo(() => {
    const Containers = containers.map(container => {
      let children;
      if (container.GI_CONTAINER.length === 0) {
        children = [
          {
            id: 'empty',
            icon: 'icon-empty',
            props: {},
            component: <Empty description={'当前容器中无可用资产，请在配置面板中集成'} />,
          },
        ];
      } else {
        children = container.GI_CONTAINER.map(getComponentById).filter(c => c);
      }
      return {
        ...container,
        children,
      };
    });

    return Containers;
  }, [ComponentCfgMap, assets]);
};

export default useContainer;
