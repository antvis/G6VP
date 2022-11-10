import { useContext } from '@alipay/graphinsight';
import * as React from 'react';
interface ActiveEdgeProps {}

const ActiveEdge: React.FunctionComponent<ActiveEdgeProps> = props => {
  const { graph } = useContext();

  React.useEffect(() => {
    const handleClick = e => {
      const { item } = e;
      graph.getEdges().forEach(edge => {
        const sourceNode = edge.get('sourceNode');
        const targetNode = edge.get('targetNode');
        if (edge.getID() === item.getID()) {
          graph.setItemState(edge, 'active', true);
          graph.setItemState(sourceNode, 'active', true);
          graph.setItemState(targetNode, 'active', true);
        } else {
          graph.setItemState(edge, 'active', false);
          graph.setItemState(sourceNode, 'active', false);
          graph.setItemState(targetNode, 'active', false);
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
