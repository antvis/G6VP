import { CircularLayout, DagreLayout, GridLayout } from '@antv/layout';

export const GAP = 50;

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
    label: '同心圆布局',
  },
  {
    value: 'dagre',
    label: '层次布局',
  },
];

export const LayoutMap = {
  grid: GridLayout,
  circular: CircularLayout,
  dagre: DagreLayout,
};
