import { defaultProps } from './registerMeta';

/** 数据映射函数  需要根据配置自动生成*/
const transform = (s, metaConfig) => {
  try {
    /** 解构配置项 */
    const props = Object.assign({}, defaultProps, metaConfig.node.props);
    const { label = {} } = props;
    const labelKey = label.mappingKey || 'id';
    const nodes = s.nodes.map(node => {
      const { id, data } = node;
     
      return {
        id: node.id,
        data: node.data,
        type: 'reason_analysis_node',
        label: data[labelKey],
      };
    });
    // const initNodes = statistics_data(nodes);
    // console.log('transform nodes', initNodes);
    // return initNodes;
    return nodes;
  } catch (error) {
    console.error('parse transform error:', error);
    return s.nodes;
  }
};
export default transform;
