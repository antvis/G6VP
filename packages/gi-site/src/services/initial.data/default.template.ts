import { GIConfig } from '@antv/gi-sdk';
import $i18n from '../../i18n';
export const baseNodesConfig: GIConfig['nodes'] = [
  {
    id: 'SimpleNode',
    name: $i18n.get({ id: 'gi-site.services.initial.data.default.template.OfficialNode', dm: '官方节点' }),
    expressions: [],
    groupName: $i18n.get({ id: 'gi-site.services.initial.data.default.template.DefaultStyle', dm: '默认样式' }),
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
    name: $i18n.get({ id: 'gi-site.services.initial.data.default.template.OfficialSide', dm: '官方边' }),
    expressions: [],
    groupName: $i18n.get({ id: 'gi-site.services.initial.data.default.template.DefaultStyle', dm: '默认样式' }),
    logic: true,
    props: {
      size: 1,
      color: '#ddd',
      label: ['source', 'target'],
    },
  },
];

export const baseLayoutConfig = {
  id: 'Force2',
  props: {
    type: 'force',
    presetLayout: {
      type: 'concentric',
    },
  },
};
