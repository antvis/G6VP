import { defaultProps } from './registerMeta';

/** 1.定义节点哪些属性可以配置 */

/** 2.根据可配置的属性，编写Transform函数 */
const registerTransform = (data, metaConfig) => {
  const { nodes } = data;
  try {
    const { node: nodeConfig } = metaConfig;
    const { mappingKey, fill } = Object.assign({}, defaultProps, nodeConfig.props);
    const transNodes = nodes.map(node => {
      return {
        id: node.id,
        type: 'RectNode',
        data: node.data,
        style: {
          text: {
            fill: fill,
            value: node.data[mappingKey],
          },
        },
      };
    });
    console.log('%c transNodes', 'color:red', transNodes);
    return transNodes;
  } catch (error) {
    return nodes;
  }
};
export default registerTransform;
