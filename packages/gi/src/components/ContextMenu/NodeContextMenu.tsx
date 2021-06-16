import { ContextMenu } from '@antv/graphin-components';
import React from 'react';
import { GIContext } from '../..';
import { uniqueElementsBy } from '../Liaoyuan/utils';
// Do not forget to import CSS
const { Menu } = ContextMenu;

const NodeMenu = () => {
  const { services, dispatch } = GIContext as any;
  const { graph, contextmenu } = React.useContext(GIContext);
  const context = contextmenu.node;

  const handleExpand = () => {
    const { nodes, edges } = graph.save() as {
      nodes: any[];
      edges: any[];
    };
    const { id } = context.item.getModel();
    services.getSubGraphData([id]).then(res => {
      console.log('ContextMenu', res);

      dispatch.changeData({
        // nodes: [...nodes, res.nodes],
        // edges: [...edges, res.edges],

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
