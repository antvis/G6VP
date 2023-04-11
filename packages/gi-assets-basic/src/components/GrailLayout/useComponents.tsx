import { Icon } from '@antv/gi-sdk';
import { Empty } from 'antd';
import React from 'react';

const useComponents = (GI_CONTAINER, ComponentCfgMap, assets, visible) => {
  return React.useMemo(() => {
    const assetKeys = [] as any[];
    GI_CONTAINER.forEach(item => {
      if (typeof item === 'string') assetKeys.push(item);
      else assetKeys.push(item.value);
    });
    const components = assetKeys
      .map(id => ComponentCfgMap?.[id])
      .filter(item => item && item.props && item.props.GIAC_CONTENT)
      .sort((a, b) => a.props.GI_CONTAINER_INDEX - b.props.GI_CONTAINER_INDEX);

    if ((!components || components.length === 0) && visible) {
      return (
        <Empty
          // 居中显示
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            left: '50%',
          }}
          description="当前容器中没用原子组件，请在左侧配置面板中添加"
        ></Empty>
      );
    }

    const Content = components?.map((item, index) => {
      if (!item) {
        console.warn(`config not found, index: ${index}`);
        return null;
      }
      const { props: itemProps, id: itemId } = item;
      const asset = assets?.[itemId];
      if (!asset) {
        console.warn(`asset: ${itemId} not found`);
        return null;
      }

      const { component: Component } = asset;
      const { icon } = item.props.GIAC_CONTENT || {};
      return (
        <div className="gi-grail-layout-component-container">
          <header>
            <Icon type={icon} style={{ color: 'var(--primary-color)', fontSize: '20px', marginRight: '8px' }} />
            {item.name}
          </header>
          <div className="gi-grail-layout-component-body">
            {/* containerHeight 是为了让 TableMode 组件能适应父容器高度，临时方案后续优化*/}
            <Component {...itemProps} />
          </div>
        </div>
      );
    });

    return Content;
  }, [GI_CONTAINER, ComponentCfgMap, assets, visible]);
};

export default useComponents;
