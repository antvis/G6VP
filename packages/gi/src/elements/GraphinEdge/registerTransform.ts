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

/** 数据映射函数  需要根据配置自动生成*/
const transform = (s, config) => {
  const { edge: mathEdgeConfig } = config;
  try {
    /** 解构配置项 */
    /** 分别生成Size和Color的Mapping */

    const mappingEdgeByColor = getMapping();
    const { color: edgeColor, label: edgeLabel, size: edgeSize } = mathEdgeConfig.props;

    /** 分别生成Size和Color的Mapping */
    const mappingEdgeBySize = scaleLinear().domain(edgeSize.scale.domain).range(edgeSize.scale.range);

    const edges = s.edges.map(edge => {
      const { data } = edge;
      const enumValueBySize = data[edgeSize?.key || 0];
      /** 根据Color字段映射的枚举值 */
      const enumValueByColor = data[edgeColor?.key || 0];
      const MappingByColor = mappingEdgeByColor(enumValueByColor, edge);

      /** 根据数组匹配，未来也是需要用户在属性面板上调整位置 */
      const colorKeys = MappingByColor.keys();
      const matchColorIndex = [...colorKeys].findIndex(c => c === enumValueByColor);
      return {
        ...edge,
        type: 'graphin-line',
        style: {
          keyshape: {
            stroke: edgeColor?.mapping ? edgeColor?.scale?.range?.[matchColorIndex] : edgeColor?.fixed,
            lineWidth: edgeSize?.mapping ? mappingEdgeBySize(enumValueBySize) : edgeSize?.fixed,
          },
          label: {
            value: edgeLabel?.showlabel ? data[edgeLabel?.key || 'id'] : '',
          },
        },
      };
    });
    return edges;
  } catch (error) {
    return s.edges;
  }
};
export default transform;
