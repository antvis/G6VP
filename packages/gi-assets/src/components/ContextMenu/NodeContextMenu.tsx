import { GraphinContext } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';
import React from 'react';

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
        const { props, id } = item;
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
    <ContextMenu style={{ width: '120px' }} bindType="node">
      <NodeMenu {...props} />
    </ContextMenu>
  );
};
export default NodeContextMenu;
