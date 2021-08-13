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
const transform = (s, metaConfig) => {
  try {
    /** 解构配置项 */
    const {
      color: Color,
      label: Label,
      size: Size,
      icon: Icon,
    } = Object.assign({}, defaultProps, metaConfig.node.props);

    /** 分别生成Size和Color的Mapping */
    const mappingBySize = scaleLinear().domain(Size.scale.domain).range(Size.scale.range);

    const mappingByColor = getMapping();
    console.log('label', Label);
    const nodes = s.nodes.map(node => {
      const { id, data } = node;
      /** 根据Size字段映射的枚举值 */
      const enumValueBySize = data[Size.key || 0];

      /** 根据Color字段映射的枚举值 */
      const enumValueByColor = data[Color.key || 0];
      const MappingByColor = mappingByColor(enumValueByColor, node);

      /** 根据数组匹配，未来也是需要用户在属性面板上调整位置 */
      const colorKeys = MappingByColor.keys();
      const matchColorIndex = [...colorKeys].findIndex(c => c === enumValueByColor);
      const keyshapeSize = Size?.mapping ? mappingBySize(enumValueBySize) : Size?.fixed;
      const keyShapeColor = Color?.mapping ? Color?.scale?.range?.[matchColorIndex] : Color?.fixed;
      const halo = {
        visible: true,
        size: keyshapeSize + 8,
        stroke: keyShapeColor,
        lineWidth: 2,
        opacity: 1,
      };

      return {
        id: node.id,
        data: node.data,
        type: 'graphin-circle',
        style: {
          keyshape: {
            stroke: keyShapeColor,
            fill: keyShapeColor,
            size: keyshapeSize,
            fillOpacity: 1,
            strokeOpacity: 1,
          },
          label: {
            value: Label?.showlabel ? data[Label?.key || 'id'] : '',
            offset: [0, 10],
            fill: Label.color,
          },
          halo,
          icon: {
            type: Icon.type,
            value: data[Icon.key] || '',
            fill: '#fff',
          },
        },
        status: {
          hover: {
            halo: {
              ...halo,
              opacity: 0.6,
            },
          },
          select: {
            halo: {
              lineWidth: 0,
            },
          },
        },
      };
    });

    console.log('%c Graphin Nodes', 'color:red', nodes);

    return nodes;
  } catch (error) {
    console.error('parse transform error:', error);
    return s.nodes;
  }
};
export default transform;
