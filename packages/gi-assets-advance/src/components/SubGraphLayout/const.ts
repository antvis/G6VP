import { CircularLayout, DagreLayout, GridLayout, ConcentricLayout, RadialLayout } from '@antv/layout';

export const NODE_SPACING = 10;

export const LAYOUTS = [
  {
    value: 'grid',
    label: '网格布局',
    options: {
      type: 'grid',
      rows: 4,
      cols: 4,
    },
  },
  {
    value: 'circular',
    label: '圆形布局',
    options: {
      nodeSpacing: NODE_SPACING,
    },
  },
  {
    value: 'dagre',
    label: '层次布局',
  },
  {
    value: 'concentric',
    label: '同心圆布局',
  },
  {
    value: 'radial',
    label: '径向布局',
  },
];

export const LayoutMap = {
  grid: GridLayout,
  circular: CircularLayout,
  dagre: DagreLayout,
  concentric: ConcentricLayout,
  radial: RadialLayout,
};
