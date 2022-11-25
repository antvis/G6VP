// import { defaultProps } from './registerMeta';
const defaultProps = {};

/** 数据映射函数  需要根据配置自动生成*/
const transform = (s, metaConfig) => {
  try {
    /** 解构配置项 */
    const props = Object.assign({}, defaultProps, metaConfig.props);
    const { label = {} } = props;
    const labelKey = label.mappingKey || 'id';
    const nodes = s.map(node => {
      const { id, data } = node;
      return {
        id: node.id,
        data: node.data,
        type: 'cluster-node',
        label: data[labelKey],
      };
    });
    console.log('transform nodes', nodes);
    return nodes;
  } catch (error) {
    console.error('parse transform error:', error);
    return s;
  }
};
export default transform;
