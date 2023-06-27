import $i18n from '../../i18n';
const registerMeta = context => {
  return {
    sortBy: {
      type: 'string',
      title: $i18n.get({ id: 'basic.layouts.Concentric.registerMeta.Sort', dm: '排序依据' }),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          { label: 'Null', value: null },
          { label: 'topology', value: 'topology' },
          { label: 'degree', value: 'degree' },
        ],
      },
      default: null,
    },
    nodeSize: {
      type: 'number',
      title: $i18n.get({ id: 'basic.layouts.Concentric.registerMeta.NodeSize', dm: '节点大小' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 80,
    },
    minNodeSpacing: {
      type: 'number',
      title: $i18n.get({ id: 'basic.layouts.Concentric.registerMeta.MinimumSpacing', dm: '最小间距' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 40,
    },
    equidistant: {
      type: 'boolean',
      title: $i18n.get({ id: 'basic.layouts.Concentric.registerMeta.EqualSpacing', dm: '是否等间距' }),
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    preventOverlap: {
      type: 'boolean',
      title: $i18n.get({ id: 'basic.layouts.Concentric.registerMeta.PreventOverlap', dm: '防止重叠' }),
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
  };
};

export default registerMeta;
