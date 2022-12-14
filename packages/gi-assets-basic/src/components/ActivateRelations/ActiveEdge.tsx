import { useContext } from '@antv/gi-sdk';
import * as React from 'react';
interface ActiveEdgeProps {}

const ActiveEdge: React.FunctionComponent<ActiveEdgeProps> = props => {
  const { graph } = useContext();

  React.useEffect(() => {
    const handleClick = e => {
      const { item } = e;
      // 先清空所有点边状态，只给当前选中边及关联点设置对应状态
      graph.getNodes().forEach(node => {
        graph.clearItemStates(node);
      });

      graph.getEdges().forEach(edge => {
        graph.clearItemStates(edge);
        const sourceNode = edge.get('sourceNode');
        const targetNode = edge.get('targetNode');
        if (edge.getID() === item.getID()) {
          graph.setItemState(edge, 'selected', true);
          graph.setItemState(sourceNode, 'active', true);
          graph.setItemState(targetNode, 'active', true);
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
