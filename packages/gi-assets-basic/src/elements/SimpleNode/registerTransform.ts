import type { GINodeConfig } from '@antv/gi-sdk/lib/typing';
import Graphin, { Utils } from '@antv/graphin';
// 引入资源文件
import iconLoader from '@antv/graphin-icons';
import '@antv/graphin-icons/dist/index.css';
import merge from 'deepmerge';

const icons = Graphin.registerFontFamily(iconLoader);

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
        size: [keyshape.size, keyshape.size],
        clip: { r: keyshape.size / 2 },
        value: value,
      };
    }

    if (icon.type === 'font') {
      return {
        ...icon,
        size: keyshape.size / 2,
        type: 'font',
        fontFamily: 'graphin',
        value: icons[value] || '',
        fill: icon.fill || keyshape.fill,
      };
    }
    if (icon.type === 'text') {
      return {
        ...icon,
        fontSize: keyshape.size / 4,
        fill: '#fff',
        value: value,
      };
    }
    return {
      ...icon,
    };
  }
  return {
    ...icon,
    visible: false,
    value: '',
  };
};

const getBadgesStyleByConfig = (style, data) => {
  const { badge, keyshape } = style;
  if (!badge || !keyshape) {
    return [];
  }

  const { visible, value } = badge;

  if (visible) {
    const size = Math.round(keyshape.size / 3);
    const fontSize = size / 2;
    badge.size = size;
    badge.stroke = keyshape.stroke;

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
      badge.color = keyshape.fill;
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
    },
    label: {
      ...label,
      visible: true,
    },
    icon: {
      ...icon,
      fill: '#fff',
      type: 'font',
      value: '',
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
};
export type NodeConfig = typeof defaultConfig;

/** 数据映射函数  需要根据配置自动生成*/
const transform = (nodes, nodeConfig: GINodeConfig, reset?: boolean) => {
  try {
    /** 解构配置项 */

    const { color, size, label: LABEL_KEYS, advanced } = merge(defaultConfig, nodeConfig.props || {}) as NodeConfig;

    let isBug = false;
    //@ts-ignore
    if (!Object.is(advanced)) {
      isBug = true;
    }
    const { halo } = isBug ? defaultConfig.advanced : advanced;

    const transNodes = nodes.map(node => {
      // properties
      const data = node.data || node.properties || node;

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

      const label = {
        ...advanced.label,
        value: advanced.label.visible ? LABEL_VALUE : '',
      };

      let preStyle = (node && node.style) || {};
      if (reset) {
        preStyle = {};
      }

      const styleByConfig = {
        keyshape,
        label,
        icon,
        halo,
        badges,
        status: {
          ...status,
          highlight: {
            keyshape: {
              lineWidth: 4,
              fillOpacity: 0.6,
            },
          },
          active: {
            halo: {
              visible: true,
            },
            keyshape: {
              lineWidth: 5,
            },
          },
          /** 扩散的状态 */
          query_start: {
            halo: {
              visible: true,
              stroke: color,
              lineWidth: 4,
              lineDash: [8, 8],
            },
          },
          query_normal: {
            halo: {
              visible: true,
              stroke: color,
              lineWidth: 1,
              lineDash: [8, 8],
            },
          },
        },
      };

      return {
        ...node,
        id: node.id,
        data,
        nodeType: node.nodeType || 'UNKNOW',
        type: 'graphin-circle',
        // 数据中的style还是优先级最高的
        style: merge(styleByConfig, preStyle),
      };
    });
    return transNodes;
  } catch (error) {
    console.error('parse transform error:', error);
    return nodes;
  }
};
export default transform;
