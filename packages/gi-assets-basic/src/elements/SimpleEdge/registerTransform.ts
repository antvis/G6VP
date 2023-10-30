import type { GIEdgeConfig } from '@antv/gi-sdk';
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
      type: 'line-edge',
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

const getLabel = (data, LABEL_KEYS) => {
  return LABEL_KEYS.map((d: string) => {
    /**
     * 兼容性处理：原先的label 逻辑是 ${type}.${properpertiesKey}
     * 现在改为 ${type}^^${properpertiesKey}
     */
    const [newNodeType, newLabelKey] = d.split('^^');
    const [oldNodeType, oldLabelKey] = d.split('.');
    const key = newLabelKey || oldLabelKey || 'id';
    /** 如果有汇总边，则强制使用汇总边的文本展示 */
    const { aggregate } = data;

    if (aggregate) {
      const sum = aggregate.reduce((acc, curr) => {
        const val = curr.data[key];
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

    return data[key];
  })
    .filter(d => d)
    .join('\n');
};

export type EdgeConfig = typeof defaultConfig;

/** 数据映射函数  需要根据配置自动生成*/
const transform = (config: GIEdgeConfig, reset?: boolean) => {
  try {
    const {
      color,
      size,
      label: LABEL_KEYS,
      advanced,
      status: defaultStatus,
    } = merge(defaultConfig, config.props) as EdgeConfig;

    const { keyshape: keyshape_CFG } = advanced;

    const transEdge = (_edge, index) => {
      const { source, target, id } = _edge;
      const edge = _edge.data;
      // properties

      const data = edge.data || edge.properties || edge;
      const isLoop = source === target;
      const isPoly = edge.isMultiple;
      let endArrow = {};
      const { customPoly, hasArrow } = keyshape_CFG;

      const keyShape = {
        type: advanced.keyshape.type || 'line-edge',
        lineWidth: size,
        stroke: color,
        opacity: advanced.keyshape.opacity,
        lineDash: advanced.keyshape.lineDash,
        lineAppendWidth: 10,
        ...(advanced.keyshape.hasArrow
          ? {}
          : {
              endArrow: {
                path: '',
              },
            }),
      };

      if (isLoop) {
        keyShape.type = 'loop-edge';
        //@ts-ignore
        keyShape.loopCfg = { position: 'top' };
      }
      // if (isPoly) {
      //   shape.type = 'poly';
      //   shape.poly = { ...edge.style?.keyshape.poly };
      // }
      // if (!isPoly && !isLoop) {
      //   //只有直线的时候才支持设置弧度，多边的默认是系统分配的弧度
      //   shape.type = 'poly';
      //   shape.poly = {
      //     distance: advanced.keyshape.poly,
      //   };
      // }
      // if (customPoly) {
      //   //如果用户要强行自定义弧度，那就随他去吧
      //   shape.poly = {
      //     distance: advanced.keyshape.poly,
      //   };
      // }
      /** LABEL */
      const LABEL_VALUE = getLabel(edge, LABEL_KEYS);

      const labelShape: any = {
        text: LABEL_VALUE || '',
        maxWidth: '400%',
        maxLines: LABEL_KEYS.length,
        fontSize: advanced.label.fontSize,
        fill: advanced.label.fill,
        offset: advanced.label.offset,
        opacity: advanced.label.opacity,
      };
      if (!advanced.label.visible) {
        labelShape.text = '';
      }

      let labelBackgroundShape = {};

      if (advanced.label.backgroundEnable) {
        labelBackgroundShape = {
          fill: advanced.label.backgroundFill,
          stroke: advanced.label.backgroundStroke,
          opacity: advanced.label.backgroundOpaciy,
        };
      }

      let preStyle = (edge && edge.style) || {};

      if (reset) {
        preStyle = {};
      }
      console.log('edge>>>', _edge);

      return {
        source,
        target,
        id,
        data: {
          type: keyShape.type,
          keyShape,
          labelShape,
          labelBackgroundShape,
          haloShape: {},
        },
      };
    };
    return transEdge;
  } catch (error) {
    console.error('parse transform error:', error);
    return edge => edge;
  }
};
export default transform;
