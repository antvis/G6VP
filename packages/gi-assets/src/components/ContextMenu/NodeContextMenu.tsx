import { GraphinContext } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';
import React from 'react';
import WrapContainer from './WrapContainer';
// Do not forget to import CSS
const { Menu } = ContextMenu;

const NodeMenu = props => {
  const { contextmenu, graph } = React.useContext(GraphinContext);
  const context = contextmenu.node;

  const { components, assets } = props;
  const sortedComponents = components.sort((a, b) => a.props?.GI_CONTAINER_INDEX - b.props?.GI_CONTAINER_INDEX);

  return (
    <Menu bindType="node">
      {sortedComponents.map(item => {
        if (!item) {
          return null;
        }
        const { props: itemProps, id } = item;
        const { component: Component } = assets[id];
        let WrapComponent = Component;
        if (itemProps.GIAC_CONTENT) {
          WrapComponent = WrapContainer(Component);
        }
        return (
          <Menu.Item key={id}>
            <WrapComponent {...itemProps} />
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

const NodeContextMenu = props => {
  return (
    <ContextMenu style={{ width: '120px' }} bindType="node">
      <NodeMenu {...props} />
    </ContextMenu>
  );
};
export default NodeContextMenu;
