import $i18n from '../../i18n';
const registerMeta = context => {
  const { keys } = context;
  // 过滤掉 nodeTypeKeyFromProperties 属性
  const options = keys.filter(d => d !== 'nodeTypeKeyFromProperties');

  return {
    rankdir: {
      type: 'string',
      title: $i18n.get({ id: 'basic.layouts.ClusteringDagre.registerMeta.LayoutDirection', dm: '布局方向' }),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            label: $i18n.get({ id: 'basic.layouts.ClusteringDagre.registerMeta.TopDown', dm: '自上而下' }),
            value: 'TB',
          },
          {
            label: $i18n.get({ id: 'basic.layouts.ClusteringDagre.registerMeta.BottomUp', dm: '自下而上' }),
            value: 'BT',
          },
          {
            label: $i18n.get({ id: 'basic.layouts.ClusteringDagre.registerMeta.FromLeftToRight', dm: '自左而右' }),
            value: 'LR',
          },
          {
            label: $i18n.get({ id: 'basic.layouts.ClusteringDagre.registerMeta.FromRightToLeft', dm: '自右而左' }),
            value: 'RL',
          },
        ],
      },
      default: 'TB',
    },
    clusterAttr: {
      type: 'string',
      title: $i18n.get({ id: 'basic.layouts.ClusteringDagre.registerMeta.HierarchicalBasis', dm: '分层依据' }),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        // options: [{ label: 'dataType', value: 'dataType@@string' }],
        options: options.map(d => {
          return {
            label: d,
            value: d,
          };
        }),
      },
      default: 'nodeType',
    },
    wrapThreshold: {
      type: 'number',
      title: $i18n.get({ id: 'basic.layouts.ClusteringDagre.registerMeta.MaximumNumberOfNodesAt', dm: '每层节点上限' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 20,
    },
    wrapLineHeight: {
      type: 'number',
      title: $i18n.get({
        id: 'basic.layouts.ClusteringDagre.registerMeta.SpacingBetweenMultipleLinesAfter',
        dm: '同层节点换行后多行之间的间距',
      }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 30,
    },
    align: {
      type: 'string',
      title: $i18n.get({ id: 'basic.layouts.ClusteringDagre.registerMeta.Alignment', dm: '对齐方式' }),
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
      title: $i18n.get({ id: 'basic.layouts.ClusteringDagre.registerMeta.NodeSpacing', dm: '节点间距' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 40,
    },
    ranksep: {
      type: 'number',
      title: $i18n.get({ id: 'basic.layouts.ClusteringDagre.registerMeta.LayerSpacing', dm: '层间距' }),
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
