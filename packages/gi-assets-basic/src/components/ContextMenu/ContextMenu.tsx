import { Components, ContextMenuValue } from '@antv/graphin';
import { Menu } from 'antd';
import React, { useMemo } from 'react';

const { ContextMenu } = Components;

const defaultStyle = {
  boxShadow: '0 4px 12px rgb(0 0 0 / 15%)',
};

const ContextMenuContainer = props => {
  const { components, assets } = props;

  const sortedComponents = useMemo(() => {
    return components.sort((a, b) => a.props?.GI_CONTAINER_INDEX - b.props?.GI_CONTAINER_INDEX);
  }, [components]);

  return (
    //@ts-ignore
    <ContextMenu bindType="node" style={defaultStyle}>
      {(menuProps: ContextMenuValue) => {
        return (
          <Menu mode="vertical">
            {sortedComponents.map(item => {
              if (!item) {
                return null;
              }
              const { props: itemProps, id: itemId } = item;
              const asset = assets[itemId];
              if (!asset) {
                console.warn(`asset: ${itemId} not found`);
                return null;
              }
              const { component: Component } = asset;
              return <Component {...itemProps} contextmenu={menuProps} key={itemId} />;
            })}
          </Menu>
        );
      }}
    </ContextMenu>
    // <div style={{ ...defaultStyle, ...positionStyle }} ref={container}>
    //   {visible && (

    //   )}
    // </div>
  );
};

export default ContextMenuContainer;
