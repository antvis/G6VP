const aggregate = data => {
  const { nodes, edges } = data;
  const edgeMap = new Map();
  edges.forEach(edge => {
    const { source, target, edgeType } = edge;
    /** 汇总边 KEY */
    const key = `${source}->${edgeType}->${target}`;

    const values = edgeMap.get(key);

    if (values) {
      edgeMap.set(key, [...values, edge]);
    } else {
      edgeMap.set(key, [edge]);
    }
  });
  const aggregateEdges = [...edgeMap.keys()].map(key => {
    const children = edgeMap.get(key);

    const firstEdge = children[0];
    const { source, target, edgeType, edgeTypeKeyFromProperties } = firstEdge;

    const aggregate = children.length > 1;
    if (aggregate) {
      return {
        source,
        target,
        edgeType,
        edgeTypeKeyFromProperties,
        aggregate: children,
        aggregateKey: key,
        data: {
          source,
          target,
          [edgeTypeKeyFromProperties]: edgeType,
          aggregate: children,
          aggregateCount: `汇总：${children.length} 条`,
        },
      };
    }
    return {
      ...firstEdge,
    };
  });

  return {
    nodes,
    edges: aggregateEdges,
  };
};

export default aggregate;
