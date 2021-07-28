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
    const props = Object.assign({}, defaultProps, metaConfig.node.props);
    const { donut = {}, label = {} } = props;
    console.log('props', props);
    /** Mock */
    const dountKeys = donut.mappingKey || [];
    const colorKeys = ['#61DDAA', '#F08BB4', '#65789B'];
    const labelKey = label.mappingKey || 'id';
    /** calculate */
    const donutColorMap = dountKeys.reduce((acc, curr, index) => {
      return {
        ...acc,
        [curr]: colorKeys[index],
      };
    }, {});

    const nodes = s.nodes.map(node => {
      const { id, data } = node;
      /**  构造 donutAttrs */
      const donutAttrs = dountKeys.reduce((acc, curr) => {
        return { ...acc, [curr]: data[curr] };
      }, {});
      const donutSumCount = dountKeys.reduce((acc, curr) => {
        return acc + data[curr];
      }, 0);
      console.log(donutSumCount);
      const size = Math.sqrt(donutSumCount) * 5;

      return {
        id: node.id,
        data: node.data,
        type: 'donut',
        label: data[labelKey],
        donutAttrs,
        donutColorMap,
        size,
        /** G6 */
        style: {
          lineWidth: 0,
        },
        labelCfg: {
          position: 'bottom',
        },
      };
    });

    console.log('%c Donut Nodes', 'color:red', nodes);

    return nodes;
  } catch (error) {
    console.error('parse transform error:', error);
    return s.nodes;
  }
};
export default transform;
