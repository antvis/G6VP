export const getAllkeysBySchema = (schema, shapeType: 'nodes' | 'edges') => {
  try {
    const keyMap = new Map<string, string>();
    // 默认要把 nodeType/edgeType 加进来
    keyMap.set(shapeType === 'nodes' ? 'nodeType' : 'edgeType', 'string');
    schema[shapeType].forEach(item => {
      Object.entries(item.properties as Record<string, string>).forEach(k => {
        keyMap.set(...k);
      });
    });
    return Array.from(keyMap);
  } catch (error) {
    return [];
  }
};
