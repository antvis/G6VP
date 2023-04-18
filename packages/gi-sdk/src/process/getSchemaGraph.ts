import { Utils } from '@antv/graphin';
const getSchemaGraph = (schemaData, config) => {
  const colorMap = new Map();
  const nodesConfigMap = new Map();
  const edgesConfigMap = new Map();
  const { nodes: nodesConfig, edges: edgesConfig } = config;
  nodesConfig.forEach(c => {
    const key = JSON.stringify(c.expressions);
    nodesConfigMap.set(key, c);
  });
  edgesConfig.forEach(c => {
    const key = JSON.stringify(c.expressions);
    edgesConfigMap.set(key, c);
  });
  const nodes = schemaData.nodes.map((n, index) => {
    const { nodeType, nodeTypeKeyFromProperties } = n;
    const expressions = [
      {
        name: nodeTypeKeyFromProperties,
        operator: 'eql',
        value: nodeType,
      },
    ];
    const key = JSON.stringify(expressions);
    const prev = nodesConfigMap.get(key);
    const color = (prev && prev.props && prev.props.color) || '#ddd';

    return {
      id: nodeType,
      style: {
        keyshape: {
          size: 20,
          fill: color,
          fillOpacity: 1,
        },
        label: {
          value: nodeType,
        },
      },
    };
  });
  const edges = schemaData.edges.map(e => {
    const { edgeType, edgeTypeKeyFromProperties } = e;
    const expressions = [
      {
        name: edgeTypeKeyFromProperties,
        operator: 'eql',
        value: edgeType,
      },
    ];
    const key = JSON.stringify(expressions);
    const prev = edgesConfigMap.get(key);
    const color = (prev && prev.props && prev.props.color) || '#ddd';

    return {
      source: e.sourceNodeType,
      target: e.targetNodeType,
      style: {
        keyshape: {
          stroke: color,
        },
        label: {
          value: e.edgeType,
          fill: color,
          fontSize: 12,
          background: {
            // 设置背景的填充色
            fill: '#fff',
            // 设置圆角
            radius: 4,
            // 设置border，即 stroke
            stroke: color,
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
