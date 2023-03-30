import { GIConfig } from '@antv/gi-sdk';
export const baseNodesConfig: GIConfig['nodes'] = [
  {
    id: 'SimpleNode',
    name: '官方节点',
    expressions: [],
    groupName: '默认样式',
    logic: true,
    props: {
      size: 26,
      color: '#ddd',
      label: [],
    },
  },
];

export const baseEdgesConfig: GIConfig['edges'] = [
  {
    id: 'SimpleEdge',
    name: '官方边',
    expressions: [],
    groupName: '默认样式',
    logic: true,
    props: {
      size: 1,
      color: '#ddd',
      label: ['source', 'target'],
    },
  },
];
export const baseLayoutConfig = {
  id: 'GraphinForce',
  props: {
    type: 'graphin-force',
    preset: {
      type: 'concentric',
    },
  },
};
