import { Item } from '@antv/g6';
import { ContextMenuValue } from '@antv/graphin';
import { Menu } from 'antd';
import React, { useMemo } from 'react';
import ContextMenu from './Container';

// const { ContextMenu } = Components;

const defaultStyle = {
  boxShadow: '0 4px 12px rgb(0 0 0 / 15%)',
};

interface ContextMenuState {
  item: Item | undefined;
}

const ContextMenuContainer = props => {
  const {
    components,
    assets,
    bindTypes,
    nodeMenuComponents = [],
    edgeMenuComponents = [],
    canvasMenuComponents = [],
    comboMenuComponents = [],
  } = props;

  const [state, setState] = React.useState<ContextMenuState>({
    item: undefined,
  });

  const sortedComponents = useMemo(() => {
    let itemType = 'canvas';
    try {
      itemType = state.item?.getType?.() || 'canvas';
    } catch (error) {
      console.log(error, state.item);
    }

    let componentIds = [];
    switch (itemType) {
      case 'edge':
        componentIds = edgeMenuComponents;
        break;
      case 'canvas':
        componentIds = canvasMenuComponents;
        break;
      case 'combo':
        componentIds = comboMenuComponents;
        break;
      default:
        componentIds = nodeMenuComponents;
    }

    const useComponents = componentIds
      .map(name => components.find(component => component.id === name))
      .filter(component => !!component);
    return useComponents.sort((a, b) => a.props?.GI_CONTAINER_INDEX - b.props?.GI_CONTAINER_INDEX);
  }, [components, nodeMenuComponents, edgeMenuComponents, canvasMenuComponents, comboMenuComponents, state.item]);

  return (
    //@ts-ignore
    <ContextMenu bindTypes={bindTypes} style={defaultStyle} setItem={item => setState({ item })}>
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
