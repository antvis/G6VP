import { Empty } from 'antd';
import React from 'react';

/**
 * 获取根据容器资产配置，获取容器内资产实例
 *
 * @param context GISDK 上下文
 * @param containers 容器资产 props.containers
 * @returns
 */
const useContainer = (context, containers) => {
  const { assets, config } = context;

  const ComponentCfgMap = config.components.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr,
    };
  }, {});
  const getComponentById = componentId => {
    const asset = assets.components[componentId];
    if (!asset) {
      console.warn(`asset: ${componentId} not found`);
      return null;
    }
    const { component: Component } = asset;
    const { props: componentProps } = ComponentCfgMap[componentId];
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
