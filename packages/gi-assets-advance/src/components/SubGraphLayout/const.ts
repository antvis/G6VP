import { CircularLayout, DagreLayout, GridLayout, ConcentricLayout, RadialLayout } from '@antv/layout';
import $i18n from '../../i18n';

export const NODE_SPACING = 20;

export const LAYOUTS = [
  {
    value: 'grid',
    label: $i18n.get({ id: 'advance.components.SubGraphLayout.const.GridLayout', dm: '网格布局' }),
    options: {
      type: 'grid',
      rows: 4,
      cols: 4,
    },
  },
  {
    value: 'circular',
    label: $i18n.get({ id: 'advance.components.SubGraphLayout.const.CircularLayout', dm: '圆形布局' }),
    options: {
      nodeSpacing: NODE_SPACING,
    },
  },
  {
    value: 'dagre',
    label: $i18n.get({ id: 'advance.components.SubGraphLayout.const.HierarchicalLayout', dm: '层次布局' }),
  },
  {
    value: 'concentric',
    label: $i18n.get({ id: 'advance.components.SubGraphLayout.const.ConcentricCircleLayout', dm: '同心圆布局' }),
  },
  {
    value: 'radial',
    label: $i18n.get({ id: 'advance.components.SubGraphLayout.const.RadialLayout', dm: '径向布局' }),
  },
];

export const LayoutMap = {
  grid: GridLayout,
  circular: CircularLayout,
  dagre: DagreLayout,
  concentric: ConcentricLayout,
  radial: RadialLayout,
};
