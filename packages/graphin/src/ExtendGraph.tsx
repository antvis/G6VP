import { Extensions, Graph as G6Graph, extend } from '@antv/g6';

const TransformGraphinData = data => {
  const { combos } = data;
  const nodes = data.nodes.map(item => {
    const { id } = item;
    return {
      id: id,
      data: item,
    };
  });

  const edges = data.edges.map((item, index) => {
    const { source, target, id } = item;
    return {
      id: item.id || `edge-${index}`,
      source,
      target,
      data: item,
    };
  });

  console.log('TransformGraphinData edges ', edges, nodes);

  return {
    nodes,
    edges,
    combos,
  };
};

export default extend(G6Graph, {
  edges: {
    'quadratic-edge': Extensions.QuadraticEdge,
  },

  layouts: {
    //@ts-ignore
    dagre: Extensions.DagreLayout,
    //@ts-ignore
    force: Extensions.ForceLayout,
    //@ts-ignore
    force2: Extensions.ForceLayout,
    //@ts-ignore
    radial: Extensions.RadialLayout,
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
