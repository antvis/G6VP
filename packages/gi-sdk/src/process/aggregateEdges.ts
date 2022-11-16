const aggregate = data => {
  const { nodes, edges } = data;
  const edgeMap = new Map();
  edges.forEach((edge, index) => {
    const { source, target, edgeType } = edge;
    /** 汇总边 KEY */
    const key = `${source}->${edgeType}->${target}`;

    const values = edgeMap.get(key);

    if (values) {
      // 为了和transform的edgeId逻辑保持一致，后续统一处理
      edgeMap.set(key, [...values, { ...edge, id: edge.id || `${source}-${target}-${index}` }]);
    } else {
      edgeMap.set(key, [{ ...edge, id: edge.id || `${source}-${target}-${index}` }]);
    }
  });
  const aggregateEdges = [...edgeMap.keys()].map(key => {
    const children = edgeMap.get(key);

    const firstEdge = children[0];
    console.log(' children', children);
    const { source, target, edgeType, edgeTypeKeyFromProperties } = firstEdge;

    const aggregate = children.length > 1;
    if (aggregate) {
      return {
        source,
        target,
        edgeType,
        edgeTypeKeyFromProperties,
        aggregate: children.map(item => {
          return {
            ...item,
            data: {
              ...item.data,
              GI_AGGREGATE_ID: key,
            },
          };
        }),
        GI_AGGREGATE_ID: key,
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
