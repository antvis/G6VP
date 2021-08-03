import { GraphinContext } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';
import React from 'react';
import { uniqueElementsBy } from '../Liaoyuan/utils';

// Do not forget to import CSS
const { Menu } = ContextMenu;

const NodeMenu = () => {
  const { services, dispatch } = GraphinContext as any;
  const { graph, contextmenu } = React.useContext(GraphinContext);
  const context = contextmenu.node;

  const handleExpand = () => {
    const { nodes, edges } = graph.save() as {
      nodes: any[];
      edges: any[];
    };
    const { id } = context.item.getModel();
    if (!services.getSubGraphData) {
      return null;
    }
    services.getSubGraphData([id]).then(res => {
      if (!res) {
        return {
          nodes,
          edges,
        };
      }
      dispatch.changeData({
        nodes: uniqueElementsBy([...nodes, ...res.nodes], (a, b) => {
          return a.id === b.id;
        }),
        edges: uniqueElementsBy([...edges, ...res.edges], (a, b) => {
          return a.source === b.source && a.target === b.target;
        }),
      });
    });
    context.handleClose();
  };

  return (
    <Menu bindType="node">
      <Menu.Item onClick={handleExpand}>一度扩散</Menu.Item>
    </Menu>
  );
};

const NodeContextMenu = () => {
  return (
    <ContextMenu style={{ width: '80px' }} bindType="node">
      <NodeMenu />
    </ContextMenu>
  );
};
export default NodeContextMenu;
