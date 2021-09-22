import { GraphinContext } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';
import React from 'react';

// Do not forget to import CSS
const { Menu } = ContextMenu;

const NodeMenu = props => {
  const { contextmenu, graph } = React.useContext(GraphinContext);
  const context = contextmenu.node;
  const { assets, components } = props;

  return (
    <Menu bindType="node">
      {components.map(item => {
        if (!item) {
          return null;
        }
        const { props, id, enable } = item;
        if (!enable) {
          return null;
        }
        const { component: Component } = assets[id];
        return (
          <Menu.Item key={id}>
            <Component {...props} />
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

const NodeContextMenu = props => {
  return (
    <ContextMenu style={{ width: '80px' }} bindType="node">
      <NodeMenu {...props} />
    </ContextMenu>
  );
};
export default NodeContextMenu;
