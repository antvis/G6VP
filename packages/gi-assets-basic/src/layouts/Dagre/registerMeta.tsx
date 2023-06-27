import $i18n from '../../i18n';
const registerMeta = context => {
  return {
    rankdir: {
      type: 'string',
      title: $i18n.get({ id: 'basic.layouts.Dagre.registerMeta.LayoutDirection', dm: '布局方向' }),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          { label: $i18n.get({ id: 'basic.layouts.Dagre.registerMeta.TopDown', dm: '自上而下' }), value: 'TB' },
          { label: $i18n.get({ id: 'basic.layouts.Dagre.registerMeta.BottomUp', dm: '自下而上' }), value: 'BT' },
          { label: $i18n.get({ id: 'basic.layouts.Dagre.registerMeta.FromLeftToRight', dm: '自左而右' }), value: 'LR' },
          { label: $i18n.get({ id: 'basic.layouts.Dagre.registerMeta.FromRightToLeft', dm: '自右而左' }), value: 'RL' },
        ],
      },
      default: 'TB',
    },
    align: {
      type: 'string',
      title: $i18n.get({ id: 'basic.layouts.Dagre.registerMeta.Alignment', dm: '对齐方式' }),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          { label: 'Null', value: null },
          { label: 'UL', value: 'UL' },
          { label: 'UR', value: 'UR' },
          { label: 'DL', value: 'DL' },
          { label: 'DR', value: 'DR' },
        ],
      },
      default: null,
    },
    nodesep: {
      type: 'number',
      title: $i18n.get({ id: 'basic.layouts.Dagre.registerMeta.NodeSpacing', dm: '节点间距' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 40,
    },
    ranksep: {
      type: 'number',
      title: $i18n.get({ id: 'basic.layouts.Dagre.registerMeta.LayerSpacing', dm: '层间距' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 80,
    },
  };
};

export default registerMeta;
