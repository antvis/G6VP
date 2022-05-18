// import { defaultProps } from './registerMeta';
const defaultProps = {};

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

/** 2.根据可配置的属性，编写Transform函数 */
const registerTransform = (siteData, metaConfig) => {
  const { nodes } = siteData;
  try {
    const { node: nodeConfig } = metaConfig;
    const { color: Color, marker: Marker, label: Label } = Object.assign({}, defaultProps, nodeConfig.props);
    console.log('nodeConfig', nodeConfig.props);
    const mappingByColor = getMapping();
    const mappingByShape = getMapping();

    const transNodes = nodes.map(node => {
      const { data } = node;
      /** 根据Color字段映射的枚举值 */
      const enumValueByColor = data[Color.key || 0];
      const MappingByColor = mappingByColor(enumValueByColor, node);
      /** 根据数组匹配，未来也是需要用户在属性面板上调整位置 */
      const colorKeys = MappingByColor.keys();
      const matchColorIndex = [...colorKeys].findIndex(c => c === enumValueByColor);

      /** 根据marker字段映射的枚举值 */
      const enumValueByShape = data[Marker.key || 0];
      const MappingByShape = mappingByShape(enumValueByShape, node);
      const shapeKeys = MappingByShape.keys();
      const matchShapeIndex = [...shapeKeys].findIndex(c => c === enumValueByShape);
      return {
        id: node.id,
        type: Marker?.mapping ? Marker?.scale?.range?.[matchShapeIndex] : Marker?.fixed,
        data: node.data,
        style: {
          shape: {
            fill: Color?.mapping ? Color?.scale?.range?.[matchColorIndex] : Color?.fixed,
          },
          text: {
            fill: Label?.showlabel ? Label.fill : '',
            value: Label?.showlabel ? data[Label?.key || 'id'] : '',
          },
        },
      };
    });

    return transNodes;
  } catch (error) {
    return nodes;
  }
};
export default registerTransform;
