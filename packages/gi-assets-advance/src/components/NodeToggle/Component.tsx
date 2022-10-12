import { GraphinContext } from '@antv/graphin';
import React from 'react';
import { uniqueElementsBy } from '../Liaoyuan/utils';
export interface NodeToggleProps {
  serviceId: '';
}

const handleExpand = (data, responseData) => {
  const { nodes, edges } = responseData;
  return {
    nodes: uniqueElementsBy([...data.nodes, ...nodes], (a, b) => {
      return a.id === b.id;
    }),
    edges: uniqueElementsBy([...data.edges, ...edges], (a, b) => {
      return a.source === b.source && a.target === b.target;
    }),
  };
};
const handleCollaspe = (data, responseData) => {
  const nodeIds = responseData.nodes.map(c => c.id);
  const edgeIds = responseData.edges.map(c => `${c.source}-${c.target}`);
  const nodes = data.nodes.filter(c => {
    return nodeIds.indexOf(c.id) === -1;
  });
  const edges = data.edges.filter(c => {
    const id = `${c.source}-${c.target}`;
    return edgeIds.indexOf(id) === -1;
  });

  return {
    nodes,
    edges,
  };
};

const NodeExpandStatus = {};
const NodeToggle: React.FunctionComponent<NodeToggleProps> = props => {
  const { services, dispatch, GiState } = GraphinContext as any;

  const { serviceId } = props;
  const graphin = React.useContext(GraphinContext);
  const { graph } = graphin as any;
  const { data } = GiState;

  React.useEffect(() => {
    const handleClick = e => {
      try {
        const nodeId = e.item.getModel().id;
        NodeExpandStatus[nodeId] = !NodeExpandStatus[nodeId];
        const { service } = services.find(sr => sr.id === serviceId);
        if (!service) {
          return;
        }
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
          if (NodeExpandStatus[nodeId]) {
            dispatch.changeData(handleExpand(data, res));
          } else {
            dispatch.changeData(handleCollaspe(data, res));
          }
        });
      } catch (e) {
        console.log(e);
      }
    };

    graph.on('node:click', handleClick);
    return () => {
      graph.off('node:click', handleClick);
    };
  }, [graph, services, serviceId, data]);
  return null;
};

export default NodeToggle;
