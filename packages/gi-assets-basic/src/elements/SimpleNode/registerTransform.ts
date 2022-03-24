import type { GINodeConfig } from '@alipay/graphinsight/lib/typing';
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

// type NodeTheme = Pick<ThemeType, 'mode' | 'primaryColor' | 'nodeSize'>;
// type IconType = 'image' | 'font' | 'text';

const getIconStyleByConfig = (style, data) => {
  const { keyshape } = style;
  const icon = { ...style.icon };
  const { value } = icon;

  if (icon.visible) {
    if (icon.type === 'image') {
      icon.fill = 'transparent';
      icon.size = [keyshape.size, keyshape.size];
      icon.clip = { r: keyshape.size / 2 };
      icon.value = value;
    }
    if (icon.type === 'font') {
      icon.type = 'font';
      icon.fontFamily = 'graphin';
      icon.value = icons[value] || '';
      icon.fill = keyshape.fill;
    }
    if (icon.type === 'text') {
      icon.fill = '#fff';
      icon.value = value;
    }
    return icon;
  }
  icon.visible = false;
  icon.value = '';
  return icon;
};

const getBadgesStyleByConfig = (style, data) => {
  const { badge, keyshape } = style;
  const { visible, value } = badge;

  if (visible) {
    badge.size = Math.round(keyshape.size / 3);
    badge.stroke = keyshape.stroke;
    if (badge.type === 'font') {
      badge.type = 'font';
      badge.fontFamily = 'graphin';
      badge.value = icons[value] || '';
    }
    if (badge.type === 'text') {
      badge.fill = '#fff';
      badge.color = keyshape.fill;
      badge.value = value;
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
  label: ['id'],
  advanced: {
    keyshape,
    label: {
      ...label,
      visible: true,
    },
    icon: {
      ...icon,
      isMapping: false,
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

    const { halo } = advanced;

    const transNodes = nodes.map(node => {
      const { id } = node;
      const data = node.data || node;
      const keyshape = {
        ...advanced.keyshape,
        fill: color,
        stroke: color,
        size: size,
      };
      advanced.keyshape = keyshape;
      /** 根据Size字段映射的枚举值 */
      const LABEL_VALUE = LABEL_KEYS.map(l => data[l]).join('_') || id;
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
        },
      };

      return {
        ...node,
        id: node.id,
        data: node.data || node,
        dataType: node.dataType || 'unkown',
        type: 'graphin-circle',
        // 数据中的style还是优先级最高的
        style: merge(styleByConfig, preStyle),
      };
    });

    console.log('%c Graphin Nodes', 'color:red', nodes);

    return transNodes;
  } catch (error) {
    console.error('parse transform error:', error);
    return nodes;
  }
};
export default transform;
