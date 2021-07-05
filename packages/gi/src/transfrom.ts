import { scaleLinear } from 'd3-scale';

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

// 大小映射
const sizeMapping = (value, domain, range) => {};

/** 数据映射函数  需要根据配置自动生成*/
const transform = (s, config) => {
  const { node: nodeConfig } = config;
  try {
    /** 解构配置项 */
    const mathNodeConfig = nodeConfig.find(cfg => cfg.enable);

    const { color: Color, label: Label, size: Size } = mathNodeConfig.props;

    /** 分别生成Size和Color的Mapping */
    const mappingBySize = scaleLinear().domain(Size.scale.domain).range(Size.scale.range);

    const mappingByColor = getMapping();

    const nodes = s.nodes.map(node => {
      const { id, data } = node;
      /** 根据Size字段映射的枚举值 */
      const enumValueBySize = data[Size?.key || 0];

      /** 根据Color字段映射的枚举值 */
      const enumValueByColor = data[Color?.key || 0];
      const MappingByColor = mappingByColor(enumValueByColor, node);

      /** 根据数组匹配，未来也是需要用户在属性面板上调整位置 */
      const colorKeys = MappingByColor.keys();
      const matchColorIndex = [...colorKeys].findIndex(c => c === enumValueByColor);

      return {
        id: node.id,
        data: node.data,
        style: {
          keyshape: {
            stroke: Color?.mapping ? Color?.scale?.range?.[matchColorIndex] : Color?.fixed,
            fill: Color?.mapping ? Color?.scale?.range?.[matchColorIndex] : Color?.fixed,
            size: Size?.mapping ? mappingBySize(enumValueBySize) : Size?.fixed,
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
