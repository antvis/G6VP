// 配置项见文档 https://yuque.antfin-inc.com/aandm7/aighig/mdrghk
// 分析组件分为两种 分析组件和分析交互
import { extractDefault } from '@ali/react-datav-gui-utils';

const configObj = {
  layout: {
    name: '布局',
    type: 'group',
    fold: false,
    enableHide: false,
    children: {
      toggle: {
        name: '切换布局',
        type: 'select',
        useFont: true,
        default: 'concentric',
        options: [
          {
            value: 'concentric',
            label: '同心圆布局',
          },
          {
            value: 'graphin-force',
            label: '力导向布局',
          },
          {
            value: 'force',
            label: '经典力导向布局',
          },

          {
            value: 'circular',
            label: '圆形布局',
          },
          {
            value: 'dagre',
            label: 'Dagre布局',
          },
          {
            value: 'radial',
            label: '辐射布局',
          },
          {
            value: 'grid',
            label: '网格布局',
          },
        ],
      },
      'graphin-force': {
        name: '配置参数',
        type: 'group',
        fold: false,
        showInPanel: {
          conditions: [['layout.toggle', '$eq', 'graphin-force']],
          logicalType: '$or',
        },
        children: {
          stiffness: {
            type: 'slider',
            caption: '边作用力',
            min: 1,
            max: 500,
            step: 1,
            default: 200,
          },
          repulsion: {
            type: 'slider',
            caption: '节点作用力',
            min: -100,
            max: 2000,
            step: 10,
            default: 1000,
          },
          damping: {
            type: 'slider',
            caption: '阻尼系数',
            default: 0.9,
            step: 0.1,
            min: 0,
            max: 1,
          },
          MaxIterations: {
            type: 'slider',
            caption: '最大迭代数',
            default: 10000,
            min: 1000,
            max: 20000,
            step: 100,
          },
          animation: {
            type: 'switch',
            caption: '是否开启动画',
            default: true,
            statusText: false,
          },
        },
      },
      force: {
        name: '配置参数',
        type: 'group',
        fold: false,
        showInPanel: {
          conditions: [['layout.toggle', '$eq', 'force']],
          logicalType: '$or',
        },
        children: {
          linkDistance: {
            type: 'slider',
            caption: '边长度',
            min: 1,
            max: 500,
            step: 1,
            default: 100,
          },
          nodeStrength: {
            type: 'slider',
            caption: '节点作用力',
            min: -100,
            max: 500,
            step: 5,
            default: 100,
          },
          edgeStrength: {
            type: 'slider',
            caption: '边作用力',
            default: 0.2,
            step: 0.1,
            min: 0,
            max: 1,
          },
          nodeSpacing: {
            type: 'slider',
            caption: '节点间距',
            default: 15,
            min: 0,
            max: 200,
            step: 1,
          },
          preventOverlap: {
            type: 'switch',
            caption: '防止重叠',
            default: true,
            statusText: false,
          },
        },
      },
      concentric: {
        type: 'group',
        name: '配置参数',
        fold: false,
        showInPanel: {
          conditions: [['layout.toggle', '$eq', 'concentric']],
          logicalType: '$or',
        },
        children: {
          sortBy: {
            type: 'select',
            caption: '排序依据',
            useFont: true,
            default: null,
            options: [
              { label: '请选择', value: null },
              { label: 'topology', value: 'topology' },
              { label: 'degree', value: 'degree' },
            ],
          },
          nodeSize: {
            type: 'slider',
            caption: '节点大小',
            default: 15,
            min: 0,
            max: 200,
            step: 1,
          },
          minNodeSpacing: {
            type: 'slider',
            caption: '最小间距',
            default: 10,
            min: 5,
            max: 50,
            step: 1,
          },
          equidistant: {
            type: 'switch',
            caption: '是否等间距',
            default: false,
          },
          preventOverlap: {
            type: 'switch',
            caption: '防止重叠',
            default: true,
            statusText: false,
          },
        },
      },
      circular: {
        type: 'group',
        name: '配置参数',
        fold: false,
        showInPanel: {
          conditions: [['layout.toggle', '$eq', 'circular']],
          logicalType: '$or',
        },
        children: {
          radius: {
            type: 'slider',
            caption: '半径',
            default: 100,
            min: 5,
            max: 2500,
            step: 1,
          },
          divisions: {
            type: 'slider',
            caption: '分段数',
            default: 1,
            step: 1,
            min: 1,
            max: 10,
          },
          ordering: {
            type: 'select',
            caption: '排序依据',
            default: null,
            options: [
              { label: '请选择', value: null },
              { label: 'topology', value: 'topology' },
              { label: 'degree', value: 'degree' },
            ],
          },
          preventOverlap: {
            type: 'switch',
            caption: '防止重叠',
            default: true,
            statusText: false,
          },
        },
      },
      dagre: {
        type: 'group',
        name: '配置参数',
        fold: false,
        showInPanel: {
          conditions: [['layout.toggle', '$eq', 'dagre']],
          logicalType: '$or',
        },
        children: {
          rankdir: {
            type: 'select',
            caption: '布局方向',
            default: 'TB',
            options: [
              { label: '自上而下', value: 'TB' },
              { label: '自下而上', value: 'BT' },
              { label: '自左而右', value: 'LR' },
              { label: '自右而左', value: 'RL' },
            ],
          },
          align: {
            type: 'select',
            caption: '对齐方式',
            default: null,
            options: [
              { label: '请选择', value: null },
              { label: 'UL', value: 'UL' },
              { label: 'UR', value: 'UR' },
              { label: 'DL', value: 'DL' },
              { label: 'DR', value: 'DR' },
            ],
          },
          nodesep: {
            type: 'slider',
            caption: '节点间距',
            default: 10,
            min: 1,
            max: 200,
            step: 1,
          },
          ranksep: {
            type: 'slider',
            caption: '层间距',
            default: 10,
            min: 1,
            max: 200,
            step: 1,
          },
        },
      },
      radial: {
        type: 'group',
        name: '配置参数',
        fold: false,
        showInPanel: {
          conditions: [['layout.toggle', '$eq', 'radial']],
          logicalType: '$or',
        },
        children: {
          unitRadius: {
            type: 'slider',
            caption: '层级距离',
            default: 100,
            min: 1,
            max: 500,
            step: 1,
          },
          focusNode: {
            type: 'text',
            caption: '中心节点',
          },
          nodeSpacing: {
            type: 'slider',
            caption: '节点间距',
            default: 15,
            min: 0,
            max: 200,
            step: 1,
          },
          preventOverlap: {
            type: 'switch',
            caption: '防止重叠',
            default: true,
            statusText: false,
          },
        },
      },
      grid: {
        type: 'group',
        name: '配置参数',
        fold: false,
        showInPanel: {
          conditions: [['layout.toggle', '$eq', 'grid']],
          logicalType: '$or',
        },
        children: {
          rows: {
            type: 'slider',
            caption: '网格行数',
            min: 1,
            max: 15,
            step: 1,
          },
          cols: {
            type: 'slider',
            caption: '网格列数',
            min: 1,
            max: 15,
            step: 1,
          },
          sortBy: {
            type: 'select',
            caption: '排序依据',
            useFont: true,
            default: null,
            options: [
              { label: '请选择', value: null },
              { label: 'topology', value: 'topology' },
              { label: 'degree', value: 'degree' },
            ],
          },
        },
      },
    },
  },
};

const valueObj = extractDefault({ config: configObj });
const props = { configObj, valueObj };

export default props;
