// 一度下钻

(data, ids) => {
  const [id] = ids;
  const expandNodes = [
    {
      id: `${id}-0`,
    },
    {
      id: `${id}-1`,
    },
  ];
  const expandEdges = [
    {
      source: id,
      target: `${id}-0`,
    },
    {
      source: id,
      target: `${id}-1`,
    },
  ];

  return {
    nodes: expandNodes,
    edges: expandEdges,
  };
};
