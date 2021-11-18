import { scaleLinear } from 'd3-scale';
import { defaultProps } from './registerMeta';

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
  const mathEdgeConfig = Object.assign({}, defaultProps, config.edge.props);
  try {
    /** 解构配置项 */
    /** 分别生成Size和Color的Mapping */

    const mappingEdgeByColor = getMapping();
    const { color: edgeColor, label: edgeLabel, size: edgeSize, dash: dash, halo: edgeHalo } = mathEdgeConfig;

    /** 分别生成Size和Color的Mapping */
    const mappingEdgeBySize = scaleLinear().domain(edgeSize?.scale?.domain).range(edgeSize?.scale?.range);

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
        dataType: edge.dataType || 'others',
        style: {
          keyshape: {
            stroke: edgeColor?.mapping ? edgeColor?.scale?.range?.[matchColorIndex] : edgeColor?.fixed,
            lineWidth: edgeSize?.mapping ? mappingEdgeBySize(enumValueBySize) : edgeSize?.fixed,
            lineDash: dash?.showdash ? [dash?.length?.fixed, dash?.length.fixed] : '',
          },
          label: {
            value: edgeLabel?.showlabel ? data[edgeLabel?.key || 'id'] : '',
            fill: edgeLabel?.showlabel ? edgeLabel?.fill?.fixed : '',
            offset: edgeLabel?.showlabel ? [0, edgeLabel?.offest?.fixed] : [0, 0],
            background: {
              fill: edgeLabel?.background?.fixed,
              stroke: edgeLabel?.border?.fixed,
            },
          },
          halo: {
            visible: edgeHalo?.showhalo,
          },
        },
      };
    });
    return edges;
  } catch (error) {
    console.error('parse transform error:', error);
    return s.edges;
  }
};
export default transform;
