const getMapping = () => {
  const Mapping = new Map();
  return (enumValue, value) => {
    const current = Mapping.get(enumValue);
    if (current) {
      Mapping.set(enumValue, [...current, value]);
    } else {
      Mapping.set(enumValue, [value]);
    }
    return Mapping;
  };
};

/** 数据映射函数  需要根据配置自动生成*/
const transform = (s, config) => {
  const { node: NodeConfig, edge: EdgeConfig } = config;
  try {
    /** 解构配置项 */
    const MathNodeConfig = NodeConfig.find(cfg => cfg.enable);
    const Size = MathNodeConfig?.size.find(s => s.enable);
    const Color = MathNodeConfig?.color.find(s => s.enable);
    const Label = MathNodeConfig?.label;
    /** 分别生成Size和Color的Mapping */
    const mappingBySize = getMapping();
    const mappingByColor = getMapping();

    const nodes = s.nodes.map(node => {
      const { id, data } = node;
      /** 根据Size字段映射的枚举值 */
      const enumValueBySize = data[Size?.key || 0];
      const MappingBySize = mappingBySize(enumValueBySize, node);
      /** 根据Color字段映射的枚举值 */
      const enumValueByColor = data[Color?.key || 0];
      const MappingByColor = mappingByColor(enumValueByColor, node);

      /** 根据数组匹配，未来也是需要用户在属性面板上调整位置 */
      const colorKeys = MappingByColor.keys();
      const matchColorIndex = [...colorKeys].findIndex(c => c === enumValueByColor);
      const sizeKeys = MappingBySize.keys();
      const matchSizeIndex = [...sizeKeys].findIndex(c => c === enumValueBySize);

      return {
        id: node.id,
        data: node.data,
        style: {
          keyshape: {
            stroke: Color?.enum?.[matchColorIndex],
            fill: Color?.enum?.[matchColorIndex],
            size: Size?.enum?.[matchSizeIndex],
          },
          label: {
            value: data[Label?.key || 'id'],
          },
        },
      };
    });
    const edges = s.edges.map(edge => {
      return edge;
    });
    return {
      nodes,
      edges,
    };
  } catch (error) {
    return s;
  }
};
export default transform;
