export const getAllkeysBySchema = (schema, shapeType: 'nodes' | 'edges') => {
  try {
    if (shapeType === 'nodes') {
      const nodeKeySet = new Set();
      // 默认要把 nodeType 加进来
      nodeKeySet.add('nodeType');
      schema.nodes.forEach(node => {
        Object.keys(node.properties).forEach(k => {
          nodeKeySet.add(k);
        });
      });
      return [...nodeKeySet];
    }
    if (shapeType === 'edges') {
      const edgeKeySet = new Set();
      // 默认要把 edgeType 加进来
      edgeKeySet.add('edgeType');
      schema.edges.forEach(edge => {
        Object.keys(edge.properties).forEach(k => {
          edgeKeySet.add(k);
        });
      });
      return [...edgeKeySet];
    }
  } catch (error) {
    return [];
  }
};
