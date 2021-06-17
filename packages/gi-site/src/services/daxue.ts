//  初始化

data => {
  const root = data.nodes[0];
  const nodes = root.data.children;
  const edges = nodes.map(n => {
    return {
      source: root.id,
      target: n.id,
    };
  });
  //return data;
  return { nodes: [root, ...nodes], edges };
};

// 一度下钻

(data, ids) => {
  const [id] = ids;
  const matchNode = data.nodes.find(n => {
    return n.id === id;
  });
  console.log('matchnode', matchNode);

  const nodes = matchNode.data?.children || [];
  const edges = nodes.map(n => {
    return {
      source: id,
      target: n.id,
    };
  });
  return {
    nodes,
    edges,
  };
};
