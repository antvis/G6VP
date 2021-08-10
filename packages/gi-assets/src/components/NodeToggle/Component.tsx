import { GraphinContext } from '@antv/graphin';
import React from 'react';
import { uniqueElementsBy } from '../Liaoyuan/utils';
export interface NodeToggleProps {
  serviceId: '';
}

const NodeToggle: React.FunctionComponent<NodeToggleProps> = props => {
  const { services, dispatch, GiState } = GraphinContext as any;

  const { serviceId } = props;
  const graphin = React.useContext(GraphinContext);
  const { graph } = graphin as any;
  const { data } = GiState;

  React.useEffect(() => {
    console.log('toggle effect...');
    const handleClick = e => {
      const nodeId = e.item.getModel().id;
      const { service } = services.find(sr => sr.id === serviceId);

      service({
        id: nodeId,
      }).then(res => {
        const { nodes, edges } = res;
        if (!res) {
          return {
            nodes,
            edges,
          };
        }
        dispatch.changeData({
          nodes: uniqueElementsBy([...data.nodes, ...nodes], (a, b) => {
            return a.id === b.id;
          }),
          edges: uniqueElementsBy([...data.edges, ...edges], (a, b) => {
            return a.source === b.source && a.target === b.target;
          }),
        });
      });
    };
    graph.on('node:click', handleClick);
    return () => {
      graph.off('node:click', handleClick);
    };
  }, [graph, services, serviceId, data]);
  return null;
};

export default NodeToggle;
