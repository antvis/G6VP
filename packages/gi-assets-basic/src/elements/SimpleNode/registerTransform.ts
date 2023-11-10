import type { GINodeConfig } from '@antv/gi-sdk';
import { icons } from '@antv/gi-sdk';
import { Utils } from '@antv/graphin';

import merge from 'deepmerge';

const defaultNodeTheme = {
  primaryColor: '#FF6A00',
  nodeSize: 26,
  mode: 'light' as 'light' | 'dark',
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
    return data[key];
  })
    .filter(d => d)
    .join('\n');
};

const getIconStyleByConfig = (style, data) => {
  const { keyshape } = style;
  if (!style.icon || !keyshape) {
    return {};
  }
  const icon = { ...style.icon };
  const { value } = icon;

  if (icon.visible) {
    if (icon.type === 'image') {
      return {
        fill: 'transparent',
        r: [keyshape.size, keyshape.size],
        clip: { r: keyshape.size / 2 },
        img: value,
        visible: true,
      };
    }
    if (icon.type === 'font') {
      return {
        fontSize: keyshape.size / 2,
        fontFamily: 'iconfont',
        text: icons[value] || '',
        fill: icon.fill || keyshape.fill,
        visible: true,
      };
    }
    if (icon.type === 'text') {
      return {
        fontSize: keyshape.size / 2,
        fill: '#fff',
        text: value,
        visible: true,
      };
    }
    return {
      ...icon,
    };
  }
  return {
    ...icon,
    visible: false,
    text: '',
  };
};

const getBadgesStyleByConfig = (style, data) => {
  const { badge, keyshape } = style;
  if (!badge || !keyshape) {
    return [];
  }

  const { visible, value, color } = badge;

  if (visible) {
    const size = Math.round(keyshape.size / 3);
    const fontSize = size / 2;
    badge.size = size;
    badge.stroke = color || keyshape.stroke;

    if (badge.type === 'mapping') {
      const b = {
        type: 'text',
        size,
        stroke: keyshape.stroke,
        fill: '#fff',
        color: keyshape.fill,
        visible: Boolean(data[value]),
        value: data[value],
        fontSize,
      };
      return [b];
    }
    if (badge.type === 'font') {
      badge.type = 'font';
      badge.fontFamily = 'graphin';
      badge.value = icons[value] || '';
    }
    if (badge.type === 'text') {
      badge.fill = '#fff';
      badge.color = color || keyshape.fill;
      badge.value = value;
      badge.fontSize = fontSize;
    }
    return [badge];
  }
  return [];
};

const defaultNodeStyles = Utils.getNodeStyleByTheme(defaultNodeTheme);

const { style, status } = defaultNodeStyles;
const { keyshape, halo, label, icon } = style;

export const defaultConfig = {
  size: defaultNodeTheme.nodeSize,
  color: defaultNodeTheme.primaryColor,
  label: [],
  advanced: {
    keyshape: {
      ...keyshape,
      fillOpacity: 0.8,
      type: 'circle-node',
    },
    label: {
      ...label,
      opacity: 1,
      visible: true,
    },
    icon: {
      ...icon,
      fill: '#fff',
      type: 'font',
      value: '',
      opacity: 1,
      visible: false,
    },
    badge: {
      visible: false,
      position: 'RT',
      type: 'text',
      value: '',
      size: Math.round(keyshape.size / 3), // 徽标占据九宫格的最右上角，所以/3
      fill: '#fff',
      color: '#fff',
      stroke: keyshape.stroke,
      isMapping: false,
    },
    halo: {
      ...halo,
      visible: false,
      lineWidth: 0,
    },
  },
  status: {
    minZoom: {
      label: {
        opacity: 0,
      },
      icon: {
        opacity: 0,
      },
      badges: {
        opacity: 0,
      },
    },
  },
};
export type NodeConfig = typeof defaultConfig;

/** 数据映射函数  需要根据配置自动生成*/
const transform = (nodeConfig: GINodeConfig, options) => {
  try {
    /** 解构配置项 */
    const { reset, renderer } = options;

    const { color, size, label: LABEL_KEYS, advanced } = merge(defaultConfig, nodeConfig.props || {}) as NodeConfig;

    let isBug = false;
    //@ts-ignore
    if (!Object.is(advanced)) {
      isBug = true;
    }
    const { halo } = isBug ? defaultConfig.advanced : advanced;
    const transNode = node => {
      // properties
      const data = node.data || node.properties || node;
      const { x, y } = data;
      const keyshape = {
        ...advanced.keyshape,
        fill: color,
        stroke: color,
        size: size,
      };

      advanced.keyshape = keyshape;
      const LABEL_VALUE = getLabel(data, LABEL_KEYS);
      const icon = getIconStyleByConfig(advanced, data);
      const badges = getBadgesStyleByConfig(advanced, data);

      let preStyle = (node && node.style) || {};
      if (reset) {
        preStyle = {};
      }
      // TODO: 若 line205 的 badges 启用，则需要从 __style 解构出传入的 badgeShapes 进行合并后给到本函数返回值
      const { keyShape: inputKeyShape, labelShape: inputLabelShape, animates, ...others } = data.__style || {};

      /** 主节点 */
      const keyShape = {
        r: size / 2 || 10,
        fill: color || 'red',
        stroke: advanced.keyshape.stroke || 'red',
        strokeOpacity: advanced.keyshape.strokeOpacity || 1,
        fillOpacity: advanced.keyshape.fillOpacity,
        ...inputKeyShape,
      };

      /** 标签 */
      const labelShape = {
        text: advanced.label.visible ? LABEL_VALUE : '' || '',
        position: advanced.label.position || 'bottom',
        maxWidth: '400%',
        maxLines: LABEL_KEYS.length,
        fill: advanced.label.fill,
        fontSize: advanced.label.fontSize,
        ...inputLabelShape,
      };
      /** 图标 */
      const iconShape = icon.visible
        ? {
            iconShape: icon,
          }
        : {};
      return {
        id: node.id,
        data: {
          type: renderer === 'webgl-3d' ? 'sphere-node' : keyshape.type,
          x: x,
          y: y,
          labelShape,
          keyShape,
          ...iconShape,
          animates: {
            update: [
              {
                fields: ['x', 'y'],
                shapeId: 'group',
              },
              // {
              //   fields: ['opacity'],
              //   shapeId: 'haloShape',
              // },
              // {
              //   fields: ['lineWidth'],
              //   shapeId: 'keyShape',
              // },
            ],
            ...animates,
          },
          ...others,
        },
      };
    };
    return transNode;
  } catch (error) {
    console.error('parse transform error:', error);
    return node => node;
  }
};
export default transform;
