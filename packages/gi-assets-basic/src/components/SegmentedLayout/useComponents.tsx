import { Empty } from 'antd';
import React from 'react';

const useComponents = (GI_CONTAINER, ComponentCfgMap, assets) => {
  return React.useMemo(() => {
    const assetKeys = [] as any[];
    GI_CONTAINER.forEach(item => {
      if (typeof item === 'string') assetKeys.push(item);
      else assetKeys.push(item.value);
    });

    const components = assetKeys.map(id => ComponentCfgMap[id]).filter(item => item.type === 'GIAC_CONTENT');

    if (!components || components.length === 0) {
      return [
        {
          id: 'empty',
          icon: 'icon-empty',
          props: {},
          children: <Empty description="当前容器中没用原子组件，请在左侧配置面板中添加"></Empty>,
        },
      ];
    }

    const Content = components.map((item, index) => {
      if (!item) {
        console.warn(`config not found, index: ${index}`);
        return null;
      }
      const { props: itemProps, id: itemId } = item;
      const asset = assets[itemId];
      if (!asset) {
        console.warn(`asset: ${itemId} not found`);
        return null;
      }

      const { component: Component } = asset;
      const { icon } = item.props.GIAC_CONTENT || {};
      return {
        id: itemId,
        icon,
        props: itemProps,
        children: <Component {...itemProps} />,
      };
    });

    return Content;
  }, [GI_CONTAINER, ComponentCfgMap, assets]);
};

export default useComponents;
