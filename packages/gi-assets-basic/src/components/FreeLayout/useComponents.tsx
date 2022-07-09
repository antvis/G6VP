import { Icon } from '@alipay/graphinsight';
import React from 'react';

const useComponents = (GI_CONTAINER, ComponentCfgMap, assets) => {
  return React.useMemo(() => {
    const components = GI_CONTAINER.map(id => ComponentCfgMap[id])
      .filter(item => item && item.props && item.props.GIAC_CONTENT)
      .sort((a, b) => a.props.GI_CONTAINER_INDEX - b.props.GI_CONTAINER_INDEX);

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

      console.log('item:', item);

      const { component: Component } = asset;
      const { icon } = item.props.GIAC_CONTENT || {};
      return (
        <div className="gi-free-layout-component-container">
          <header>
            <Icon type={icon} style={{ color: 'var(--primary-color)', fontSize: '20px', marginRight: '8px' }} />
            {item.name}
          </header>
          <Component {...itemProps} />
        </div>
      );
    });

    return Content;
  }, [GI_CONTAINER, ComponentCfgMap, assets]);
};

export default useComponents;
