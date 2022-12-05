import { useContext } from '@antv/gi-sdk';
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
        const isSelectedEdge = edge.getID() === item.getID();
        graph.setItemState(edge, 'selected', isSelectedEdge);
        graph.setItemState(sourceNode, 'active', isSelectedEdge);
        graph.setItemState(targetNode, 'active', isSelectedEdge);
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
