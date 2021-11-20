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
      let icon: { [key: string]: any } = {};
      if (Icon.enable) {
        icon = {
          type: Icon.type,
          value: data[Icon.key] || '',
        };
        if (Icon.type === 'image') {
          icon.fill = 'transparent';
          icon.size = [keyshapeSize, keyshapeSize];
          icon.clip = { r: keyshapeSize / 2 };
        } else {
          icon.fill = '#fff';
        }
      }
      if (node.data.details) {
        return {
          id: node.id,
          data: node.data,
          type: 'circle-bar',
          label: Label?.enable ? data[Label?.key || 'id'] : '',
          details: node.data.details,
          labelColor: Label?.color,
          centerColor: keyShapeColor,
          size: keyshapeSize,
        };
      }
      return {
        id: node.id,
        data: node.data,
        label: Label?.enable ? data[Label?.key || 'id'] : '',
        type: 'graphin-circle',

        dataType: node.dataType || 'others',

        style: {
          keyshape: {
            stroke: keyShapeColor,
            fill: keyShapeColor,
            size: keyshapeSize,
            fillOpacity: 0.3,
            strokeOpacity: 1,
          },
          label: {
            value: Label?.enable ? data[Label?.key || 'id'] : '',
            offset: [0, 10],
            fill: Label.color,
          },
        },
      };
    });

    console.log('%c  Nodes', 'color:red', nodes);

    return nodes;
  } catch (error) {
    console.error('parse transform error:', error);
    return s.nodes;
  }
};
export default transform;
