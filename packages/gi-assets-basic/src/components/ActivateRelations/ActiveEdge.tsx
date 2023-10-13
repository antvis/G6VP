import { IG6GraphEvent, useContext } from '@antv/gi-sdk';
import * as React from 'react';
interface ActiveEdgeProps {}

const ActiveEdge: React.FunctionComponent<ActiveEdgeProps> = props => {
  const { graph } = useContext();

  React.useEffect(() => {
    const handleClick = (e: IG6GraphEvent) => {
      const { itemId } = e;

      // 先清空所有点边状态，只给当前选中边及关联点设置对应状态
      graph.getAllNodesData().forEach(node => {
        graph.clearItemState(node.id);
      });

      graph.getAllEdgesData().forEach(edge => {
        const { id, source, target } = edge;
        graph.clearItemStates(id);
        if (id === itemId) {
          graph.setItemState(id, 'selected', true);
          graph.setItemState(source, 'active', true);
          graph.setItemState(target, 'active', true);
        }
      });
    };
    graph.on('edge:click', handleClick);
    return () => {
      graph.off('edge:click', handleClick);
    };
  }, [graph]);
  return null;
};

export default ActiveEdge;
