const defaultProps = {
  donut: [],
  label: ['id'],
  donutColors: '',
  size: undefined,
};
/** 数据映射函数  需要根据配置自动生成*/
const transform = (nodes, nodeConfig) => {
  try {
    /** 解构配置项 */
    const props = Object.assign({}, defaultProps, nodeConfig.props);
    const { donut: dountKeys, label: labelKey, donutColors, size: SIZE } = props;

    let colorKeys = ['#61DDAA', '#F08BB4', '#65789B'];
    if (typeof donutColors === 'string') {
      colorKeys = donutColors.split(',') || ['#61DDAA', '#F08BB4', '#65789B'];
    }

    const donutColorMap = dountKeys.reduce((acc, curr, index) => {
      return {
        ...acc,
        [curr]: colorKeys[index],
      };
    }, {});

    const transNodes = nodes.map(node => {
      const { id } = node;
      const data = node.data || node;
      /**  构造 donutAttrs */
      const donutAttrs = dountKeys.reduce((acc, curr) => {
        return { ...acc, [curr]: data[curr] };
      }, {});
      const donutSumCount = dountKeys.reduce((acc, curr) => {
        return acc + data[curr];
      }, 16);

      const size = SIZE || Math.sqrt(donutSumCount) * 5;
      return {
        id,
        data,
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

    return transNodes;
  } catch (error) {
    console.error('parse transform error:', error);
    return nodes;
  }
};
export default transform;
