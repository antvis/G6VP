import type { GIEdgeConfig } from '@alipay/graphinsight/lib/typing';
import { Utils } from '@antv/graphin';
import merge from 'deepmerge';

const defaultEdgeTheme = {
  primaryEdgeColor: '#ddd',
  edgeSize: 1,
  mode: 'light' as 'light' | 'dark',
};

const defaultEdgeStyles = Utils.getEdgeStyleByTheme(defaultEdgeTheme);

const { style, status } = defaultEdgeStyles;
const { keyshape, label } = style;

export const defaultConfig = {
  size: defaultEdgeTheme.edgeSize,
  color: defaultEdgeTheme.primaryEdgeColor,
  label: [],
  advanced: {
    keyshape: {
      multilple: true,
      poly: 30,
      loop: 10,
      lineDash: [],
      lineAppendWidth: keyshape.lineWidth,
      opacity: keyshape.strokeOpacity,
    },
    label: {
      visible: true,
      fontSize: label.fontSize,
      offset: [0, 0],
      fill: label.fill,
      backgroundEnable: false,
      backgroundFill: defaultEdgeTheme.primaryEdgeColor,
      backgroundStroke: '#fff',
    },
    animate: {
      visible: false,
      type: 'circle-running',
      dotColor: 'red',
      repeat: true,
      duration: 3000,
    },
  },
};

export type EdgeConfig = typeof defaultConfig;

/** 数据映射函数  需要根据配置自动生成*/
const transform = (edges, config: GIEdgeConfig, reset?: boolean) => {
  try {
    const { color: color_CFG, size: size_CFG, label: LABEL_KEYS, advanced } = merge(
      defaultConfig,
      config.props,
    ) as EdgeConfig;

    const { keyshape: keyshape_CFG } = advanced;
    const { multilple, poly, loop } = keyshape_CFG;

    let processedEdge = edges;
    if (multilple) {
      processedEdge = Utils.processEdges(Utils.cloneDeep(edges), {
        poly: poly,
        loop: loop,
      });
    }
    console.log('processedEdge', edges, processedEdge, advanced, multilple);

    const transEdges = processedEdge.map(edge => {
      const data = edge.data || edge;

      /** LABEL */
      const LABEL_VALUE = LABEL_KEYS.map(l => data[l]).join('_');
      const label: any = {
        value: LABEL_VALUE,
        offset: advanced.label.offset,
        fontSize: advanced.label.fontSize,
        fill: advanced.label.fill,
      };
      if (!advanced.label.visible) {
        label.value = '';
      }
      if (advanced.label.backgroundEnable) {
        label.background = {
          fill: advanced.label.backgroundFill,
          stroke: advanced.label.backgroundStroke,
        };
      }

      let preStyle = (edge && edge.style) || {};

      if (reset) {
        preStyle = {};
      }

      return {
        ...edge,
        data,
        type: 'graphin-line',
        edgeType: edge.edgeType || 'UNKOWN',
        style: merge(
          {
            keyshape: {
              // type: 'line',
              type: 'poly',
              poly: {
                distance: poly,
              },
              // ...edge.style?.keyshape,
              lineWidth: size_CFG,
              stroke: color_CFG,
              opacity: keyshape_CFG.opacity,
              lineDash: keyshape_CFG.lineDash,
              lineAppendWidth: keyshape_CFG.lineAppendWidth,
            },
            label,
            animate: {
              visible: advanced.animate.visible,
              type: advanced.animate.type,
              color: advanced.animate.dotColor,
              repeat: advanced.animate.repeat,
              duration: advanced.animate.duration,
            },
          },
          preStyle,
        ),
      };
    });
    return transEdges;
  } catch (error) {
    console.error('parse transform error:', error);
    return edges;
  }
};
export default transform;
