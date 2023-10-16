type Item = any;
import { useComponents, useContext } from '@antv/gi-sdk';
import { ContextMenuValue } from '@antv/graphin';
import { Menu } from 'antd';
import React, { memo } from 'react';
import ContextMenu from './Container';
import './index.less';

// const { ContextMenu } = Components;

const defaultStyle = {
  minWidth: '130px',
  boxShadow: '0 4px 12px rgb(0 0 0 / 15%)',
};

interface ContextMenuState {
  item: Item | undefined;
}

const ContextMenuContainer = props => {
  const { GI_CONTAINER } = props;
  const { config, assets } = useContext();
  const { components } = useComponents(GI_CONTAINER, config, assets);
  console.log(' components', components);
  return (
    //@ts-ignore
    <ContextMenu style={defaultStyle} setItem={item => setState({ item })}>
      {(menuContext: ContextMenuValue) => {
        console.log('......', menuContext);
        return (
          <Menu mode="vertical">
            {components.map(item => {
              return (
                <span key={item.id}>
                  <item.component contextmenu={menuContext} {...item.props} />
                </span>
              );
            })}
          </Menu>
        );
      }}
    </ContextMenu>
  );
};

export default memo(ContextMenuContainer);
