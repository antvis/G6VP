import type { GIEdgeConfig } from '@alipay/graphinsight/lib/typing';
import { Utils } from '@antv/graphin';
import merge from 'deepmerge';
const defaultEdgeTheme = {
  primaryEdgeColor: '#ddd',
  edgeSize: 1,
  mode: 'light' as 'light' | 'dark',
};

const defaultEdgeStyles = Utils.getEdgeStyleByTheme(defaultEdgeTheme);

/** 数据映射函数  需要根据配置自动生成*/
const transform = (edges, config: GIEdgeConfig, reset?: boolean) => {
  try {
    const transEdges = edges.map(edge => {
      const data = edge.data || edge;
      let preStyle = (edge && edge.style) || {};
      if (reset) {
        preStyle = {};
      }
      return {
        ...edge,
        type: 'graphin-line',
        dataType: edge.dataType || 'others',
        style: merge(defaultEdgeStyles.style, preStyle),
      };
    });
    return transEdges;
  } catch (error) {
    console.error('parse transform error:', error);
    return edges;
  }
};
export default transform;
