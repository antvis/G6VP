import type { GIEdgeConfig } from '@alipay/graphinsight/lib/typing';
import { Utils } from '@antv/graphin';
import merge from 'deepmerge';

const defaultEdgeTheme = {
  primaryEdgeColor: '#ddd',
  edgeSize: 1,
  mode: 'light' as 'light' | 'dark',
};

const defaultEdgeStyles = Utils.getEdgeStyleByTheme(defaultEdgeTheme);

const { style } = defaultEdgeStyles;
const { keyshape, label } = style;

export const defaultConfig = {
  size: defaultEdgeTheme.edgeSize,
  color: defaultEdgeTheme.primaryEdgeColor,
  label: [],
  advanced: {
    keyshape: {
      customPoly: false,
      poly: 0,
      lineDash: [0, 0],
      // lineAppendWidth: keyshape.lineWidth,
      opacity: keyshape.strokeOpacity,
    },
    label: {
      visible: true,
      fontSize: label.fontSize,
      offset: [0, 0],
      fill: label.fill,
      backgroundEnable: true,
      backgroundFill: '#fff',
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

    const transEdges = edges.map(edge => {
      const data = edge.data || edge;
      const isLoop = edge.style && edge.style.keyshape && edge.style.keyshape.type === 'loop';
      const isPoly = edge.isMultiple;
      const { customPoly } = keyshape_CFG;
      const shape: any = {};
      if (isLoop) {
        shape.type = 'loop';
        shape.loop = { ...edge.style.keyshape.loop };
      }
      if (isPoly) {
        shape.type = 'poly';
        shape.poly = { ...edge.style.keyshape.poly };
      }
      if (!isPoly && !isLoop) {
        //只有直线的时候才支持设置弧度，多边的默认是系统分配的弧度
        shape.type = 'poly';
        shape.poly = {
          distance: advanced.keyshape.poly,
        };
      }
      if (customPoly) {
        //如果用户要强行自定义弧度，那就随他去吧
        shape.poly = {
          distance: advanced.keyshape.poly,
        };
      }

      /** LABEL */
      // const LABEL_VALUE = LABEL_KEYS.map(l => data[l]).join('_');

      const LABEL_VALUE = LABEL_KEYS.map((d: string) => {
        const [edgeType, propObjKey, propName] = d.split('.');
        if (edge.edgeType || 'UNKNOW' === edgeType) {
          // 只有当 nodeType 匹配时才取对应的属性值
          if (propName) {
            // propName 存在，则 propObjKey 值一定为 properties
            return data[propObjKey][propName];
          }
          return data[propObjKey];
        }
        return data[edgeType];
      })
        .filter(d => d)
        .join('\n');

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

      const finalStyle = merge(
        {
          keyshape: {
            ...shape,
            // ...edge.style?.keyshape,
            lineWidth: size_CFG,
            stroke: color_CFG,
            opacity: keyshape_CFG.opacity,
            lineDash: keyshape_CFG.lineDash,
            lineAppendWidth: 10, //keyshape_CFG.lineAppendWidth,
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
      );

      return {
        ...edge,
        data,
        type: 'graphin-line',
        edgeType: edge.edgeType || 'UNKOWN',
        style: finalStyle,
      };
    });
    return transEdges;
  } catch (error) {
    console.error('parse transform error:', error);
    return edges;
  }
};
export default transform;
