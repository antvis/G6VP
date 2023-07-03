import { Item } from '@antv/g6';
import { ContextMenuValue } from '@antv/graphin';
import { Menu } from 'antd';
import React, { useMemo } from 'react';
import { GIComponentConfig, GIComponentAssets } from '@antv/gi-sdk';
import ContextMenu, { ContextMenuProps } from './Container';

// const { ContextMenu } = Components;

const defaultStyle = {
  minWidth: '130px',
  boxShadow: '0 4px 12px rgb(0 0 0 / 15%)',
};

interface ContextMenuState {
  item: Item | undefined;
}

export interface ContextMenuContainerProps extends Pick<ContextMenuProps, 'bindTypes'> {
  components: GIComponentConfig[];
  assets: GIComponentAssets;
}

const ContextMenuContainer = (props: ContextMenuContainerProps) => {
  const { components = [], assets, bindTypes } = props;

  const [state, setState] = React.useState<ContextMenuState>({
    item: undefined,
  });

  const sortedComponents = useMemo(
    () => components.sort((a, b) => Number(a.props?.GI_CONTAINER_INDEX) - Number(b.props?.GI_CONTAINER_INDEX)),
    [components, state.item],
  );

  return (
    //@ts-ignore
    <ContextMenu style={defaultStyle} bindTypes={bindTypes} setItem={item => setState({ item })}>
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
  );
};

export default ContextMenuContainer;
