import { Extensions, Graph as G6Graph, extend } from '@antv/g6';

const TransformGraphinData = data => {
  const { nodes, combos } = data;

  const edges = data.edges.map((item, index) => {
    return {
      ...item,
      id: item.id || `edge-${index}`,
    };
  });

  return {
    nodes,
    edges,
    combos,
  };
};

export default extend(G6Graph, {
  layouts: {
    //@ts-ignore
    dagre: Extensions.DagreLayout,
    //@ts-ignore
    force: Extensions.ForceLayout,
    //@ts-ignore
    force2: Extensions.ForceLayout,
  },
  behaviors: {
    //@ts-ignore
    'zoom-canvas': Extensions.ZoomCanvas,
    //@ts-ignore
    'drag-canvas': Extensions.DragCanvas,
    'drag-node': Extensions.DragNode,
  },
  plugins: {
    minimap: Extensions.Minimap,
    menu: Extensions.Menu,
  },
  //@ts-ignore
  transforms: {
    'transform-graphin-data': TransformGraphinData,
  },
});
