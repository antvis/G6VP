import type { GIEdgeConfig } from '@antv/gi-sdk/lib/typing';
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
      hasArrow: true,
    },
    label: {
      visible: true,
      fontSize: label.fontSize,
      offset: [0, 0],
      fill: label.fill,
      backgroundEnable: true,
      backgroundFill: '#fff',
      backgroundStroke: '#fff',
      backgroundOpaciy: 1,
      opacity: 1,
    },
    animate: {
      visible: false,
      type: 'circle-running',
      dotColor: 'red',
      repeat: true,
      duration: 3000,
    },
  },
  status: {
    minZoom: {
      label: {
        opacity: 0,
      },
      'label-background': {
        opacity: 0,
      },
    },
  },
};

export type EdgeConfig = typeof defaultConfig;

/** 数据映射函数  需要根据配置自动生成*/
const transform = (edges, config: GIEdgeConfig, reset?: boolean) => {
  try {
    const {
      color: color_CFG,
      size: size_CFG,
      label: LABEL_KEYS,
      advanced,
      status: defaultStatus,
    } = merge(defaultConfig, config.props) as EdgeConfig;

    const { keyshape: keyshape_CFG } = advanced;

    const transEdges = edges.map((edge, index) => {
      // properties
      const { source, target } = edge;
      const id = edge.id || `${source}-${target}-${index}`;
      const data = edge.data || edge.properties || edge;
      const isLoop = edge.source === edge.target; //edge.style && edge.style.keyshape && edge.style.keyshape.type === 'loop';
      const isPoly = edge.isMultiple;
      let endArrow = {};
      const { customPoly, hasArrow } = keyshape_CFG;
      if (!hasArrow) {
        //@ts-ignore
        endArrow = {
          endArrow: {
            path: '',
          },
        };
      }
      const shape: any = {};
      if (isLoop) {
        shape.type = 'loop';
        shape.loop = { ...edge.style?.keyshape.loop };
      }
      if (isPoly) {
        shape.type = 'poly';
        shape.poly = { ...edge.style?.keyshape.poly };
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
        /**
         * 兼容性处理：原先的label 逻辑是 ${type}.${properpertiesKey}
         * 现在改为 ${type}^^${properpertiesKey}
         */
        const newLabelArray = d.split('^^');
        const oldLabelArray = d.split('.');
        let [edgeType, propObjKey, propName] = newLabelArray;
        const isOld = newLabelArray.length === 1 && newLabelArray[0].split('.').length > 1;
        if (isOld) {
          edgeType = oldLabelArray[0];
          propObjKey = oldLabelArray[1];
          propName = oldLabelArray[2];
        }

        // const [edgeType, propObjKey, propName] = d.split('^^');

        // 只有当 nodeType 匹配时才取对应的属性值
        if (edge.edgeType || 'UNKNOW' === edgeType) {
          // propName 存在，则 propObjKey 值一定为 properties
          if (propName) {
            return data[propObjKey][propName];
          }
          /** 如果有汇总边，则强制使用汇总边的文本展示 */
          const { aggregate } = data;
          if (aggregate) {
            const sum = aggregate.reduce((acc, curr) => {
              const val = curr.data[propObjKey];
              if (typeof val === 'number') {
                acc = acc + val;
                return acc;
              } else {
                return '';
              }
            }, 0);
            if (sum === '') {
              return data['aggregateCount'];
            }
            return `(${aggregate.length} 条)：${sum.toFixed(2)}`;
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
        opacity: advanced.label.opacity,
      };
      if (!advanced.label.visible) {
        label.value = '';
      }
      if (advanced.label.backgroundEnable) {
        label.background = {
          fill: advanced.label.backgroundFill,
          stroke: advanced.label.backgroundStroke,
          opacity: advanced.label.backgroundOpaciy,
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
            ...endArrow,
          },
          label,
          animate: {
            visible: advanced.animate.visible,
            type: advanced.animate.type,
            color: advanced.animate.dotColor,
            repeat: advanced.animate.repeat,
            duration: advanced.animate.duration,
          },
          status: {
            ...defaultStatus,
          },
        },
        preStyle,
      );

      return {
        ...edge,
        source,
        target,
        id,
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
