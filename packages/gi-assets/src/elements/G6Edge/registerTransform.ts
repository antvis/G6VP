import { Utils } from '@antv/graphin';
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
    const { color: edgeColor, label: edgeLabel, size: edgeSize, dash: dash, multilple } = mathEdgeConfig;

    /** 分别生成Size和Color的Mapping */
    const mappingEdgeBySize = scaleLinear().domain(edgeSize?.scale?.domain).range(edgeSize?.scale?.range);
    /** 多边处理 */
    let processedEdge = s.edges;
    if (multilple.enable) {
      processedEdge = Utils.processEdges(s.edges, { poly: multilple.poly || 50, loop: multilple.loop || 10 });
    }

    const edges = processedEdge.map(edge => {
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
        // source: edge.source,
        // target: edge.target,
        // data: edge.data,

        type: 'arc',
        dataType: edge.dataType || 'others',
        ...edge.style?.keyshape,
        color: edgeColor?.mapping ? edgeColor?.scale?.range?.[matchColorIndex] : edgeColor?.fixed,
        size: edgeSize?.mapping ? mappingEdgeBySize(enumValueBySize) : edgeSize?.fixed,
        style: {
          lineDash: dash?.showdash ? [dash?.length?.fixed, dash?.length.fixed] : '',
        },
        label: edgeLabel?.showlabel ? data[edgeLabel?.key || 'id'] : '',
        labelCfg: {
          style: {
            fill: edgeLabel?.showlabel ? edgeLabel?.fill?.fixed : '',
            // offset: edgeLabel?.showlabel ? [0, edgeLabel?.offest?.fixed] : [0, 0],
            stroke: edgeLabel?.border?.fixed,
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
