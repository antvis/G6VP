export const getAllkeysBySchema = (schema, shapeType: 'nodes' | 'edges') => {
  try {
    const keySet = new Set<[string, string]>();
    // 默认要把 nodeType/edgeType 加进来
    keySet.add([shapeType === 'nodes' ? 'nodeType' : 'edgeType', 'string']);
    schema[shapeType].forEach(item => {
      Object.entries(item.properties as Record<string, string>).forEach(k => {
        keySet.add(k);
      });
    });
    return [...keySet];
  } catch (error) {
    return [];
  }
};
