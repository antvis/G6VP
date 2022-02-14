import { Menu } from 'antd';
import React, { createRef } from 'react';
import useContextMenu from './useContextMenu';

const defaultStyle = {
  width: '120px',
  boxShadow: '0 4px 12px rgb(0 0 0 / 15%)',
};

const container = createRef();
const ContextMenu = props => {
  const contextmenu = useContextMenu({
    bindType: 'node',
    container,
  });
  const { oneShow, onClose, id, item, visible, x, y } = contextmenu;

  const { components, assets } = props;
  const sortedComponents = components.sort((a, b) => a.props?.GI_CONTAINER_INDEX - b.props?.GI_CONTAINER_INDEX);

  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
  };

  return (
    //@ts-ignore
    <div style={{ ...defaultStyle, ...positionStyle }} ref={container}>
      {visible && (
        <Menu style={{ width: 120 }} mode="vertical">
          {sortedComponents.map(item => {
            if (!item) {
              return null;
            }
            const { props: itemProps, id } = item;
            const { component: Component } = assets[id];
            return <Component {...itemProps} contextmenu={contextmenu} key={id} />;
          })}
        </Menu>
      )}
    </div>
  );
};

export default ContextMenu;
