import { Utils } from '@antv/graphin';
const getSchemaGraph = schemaData => {
  const nodes = schemaData.nodes.map(n => {
    return {
      id: n.nodeType,
      style: {
        keyshape: {
          size: 20,
          fill: '#305cff',
          fillOpacity: 1,
        },
        label: {
          value: n.nodeType,
        },
      },
    };
  });
  const edges = schemaData.edges.map(e => {
    return {
      source: e.sourceNodeType,
      target: e.targetNodeType,
      style: {
        keyshape: {
          stroke: '#305cff',
        },
        label: {
          value: e.edgeType,
          fill: '#305cff',
          fontSize: 12,
          background: {
            // 设置背景的填充色
            fill: '#fff',
            // 设置圆角
            radius: 8,
            // 设置border，即 stroke
            stroke: '#305cff',
          },
        },
      },
    };
  });

  return {
    nodes,
    edges: Utils.processEdges(edges),
  };
};

export default getSchemaGraph;
