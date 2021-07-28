import Graphin from '@antv/graphin';
import IconLoader from '@antv/graphin-icons';
import '@antv/graphin-icons/dist/index.css';
import { defaultProps } from './registerMeta';

const icons = Graphin.registerFontFamily(IconLoader);

/** 数据映射函数  需要根据配置自动生成*/
const transform = (s, metaConfig) => {
  const { node: nodeConfig } = metaConfig;
  try {
    /** 解构配置项 */
    const props = Object.assign({}, defaultProps, nodeConfig.props);
    console.log('%c props', 'color:red', props);
    const primaryColor = '#f44336';
    const nodeSize = 26;
    const badgeSize = 8;

    const nodes = s.nodes.map(node => {
      const { id, data } = node;
      const badgeNumber = data?.properties?.length;
      let badgesShape = {};
      if (badgeNumber) {
        badgesShape = {
          badges: [
            {
              position: 'RT',
              type: 'text',
              value: badgeNumber,
              size: [badgeSize, badgeSize],
              fill: primaryColor,
              stroke: primaryColor,
              color: '#fff',
              fontSize: badgeSize * 0.8,
              padding: 0,
              offset: [0, 0],
            },
          ],
        };
      }

      return {
        id: node.id,
        data: node.data,
        type: 'graphin-circle',
        style: {
          keyshape: {
            fill: primaryColor,
            fillOpacity: 0.1,
            strokeWidth: 1.2,
            stroke: primaryColor,
            size: nodeSize,
          },
          icon: {
            fontFamily: 'graphin',
            type: 'font',
            value: icons.team,
            fill: primaryColor,
            size: nodeSize / 1.6,
          },
          label: {
            value: data.name,
            fill: '#000',
            fillOpacity: 0.85,
          },
          halo: {
            visible: true,
            stroke: '#ddd',
          },
          ...badgesShape,
        },
      };
    });
    console.log('%c Simple Nodes', 'color:red', nodes);
    return nodes;
  } catch (error) {
    console.error('parse transform error:', error);
    return s.nodes;
  }
};
export default transform;
