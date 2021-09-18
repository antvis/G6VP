import { GraphinContext } from '@antv/graphin';
import * as React from 'react';
import { defaultProps } from './registerMeta';
interface NodeExpandProps {
  placement: 'LB' | 'RB';
}
/** 数组去重 */
export const uniqueElementsBy = (arr: any[], fn: (arg0: any, arg1: any) => any) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x: any) => fn(v, x))) acc.push(v);
    return acc;
  }, []);

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

const NodeExpand: React.FunctionComponent<NodeExpandProps> = props => {
  /** Graphin */
  const { services, dispatch, GiState } = GraphinContext as any;
  const { graph } = React.useContext(GraphinContext);
  const { data: GiData } = GiState;

  console.log('render... NodeExpand');

  const { nodes, edges } = graph.save() as {
    nodes: any[];
    edges: any[];
  };
  /** Props */
  const { serviceId } = { ...defaultProps, ...props };
  const { service } = services.find(sr => sr.id === serviceId);
  /** GI */

  React.useEffect(() => {
    console.log('effect...NodeExpand');
    if (!service) {
      return;
    }
    const handleDblClick = e => {
      const { id } = e.item.getModel();
      service({
        id,
      }).then(res => {
        if (!res) {
          return;
        }
        dispatch.changeData(handleExpand(GiData, res));
      });
    };
    graph.on('node:dblclick', handleDblClick);
    return () => {
      graph.off('node:dblclick', handleDblClick);
    };
  }, [graph, service, GiData]);

  return null;
};

export default NodeExpand;
