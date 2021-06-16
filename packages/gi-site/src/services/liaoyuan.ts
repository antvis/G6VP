//初始化接口

data => {
  const getEdgesByNodes = (nodes, edges) => {
    const ids = nodes.map(node => node.id);
    return edges.filter(edge => {
      const { source, target } = edge;
      if (ids.indexOf(source) !== -1 && ids.indexOf(target) !== -1) {
        return true;
      }
      return false;
    });
  };

  const nodes = data.nodes.filter(node => {
    return node.data.type === 'ENTITY' || node.data.type === 'EVENT';
  });

  const edges = getEdgesByNodes(nodes, data.edges);

  return {
    nodes,
    edges,
  };
};

// 一度下钻接口

(data, ids) => {
  const getEdgesByNodes = (nodes, edges) => {
    const ids = nodes.map(node => node.id);
    return edges.filter(edge => {
      const { source, target } = edge;
      if (ids.indexOf(source) !== -1 && ids.indexOf(target) !== -1) {
        return true;
      }
      return false;
    });
  };

  const propertiesNodes = data.nodes
    .filter(node => {
      return ids.indexOf(node.id) !== -1;
    })
    .map(node => {
      return node.data.properties.map(n => {
        return {
          data: n,
          id: n.uri,
        };
      });
    })
    .reduce((acc, curr) => {
      return [...acc, ...curr];
    }, []);

  /**初始化图的节点*/
  const graphOriginNodes = data.nodes.filter(node => {
    return node.data.type === 'ENTITY' || node.data.type === 'EVENT';
  });
  const nodes = [...propertiesNodes, ...graphOriginNodes];
  const edges = getEdgesByNodes(nodes, data.edges);

  /** End：组件市场里定义的逻辑;*/

  return {
    nodes: propertiesNodes,
    edges,
  };
};
