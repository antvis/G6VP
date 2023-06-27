import $i18n from '../../i18n';
const registerMeta = context => {
  return {
    rows: {
      type: 'number',
      title: $i18n.get({ id: 'basic.layouts.Grid.registerMeta.NumberOfGridRows', dm: '网格行数' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
    },
    cols: {
      type: 'slider',
      title: $i18n.get({ id: 'basic.layouts.Grid.registerMeta.NumberOfGridColumns', dm: '网格列数' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
    },
    sortBy: {
      type: 'select',
      title: $i18n.get({ id: 'basic.layouts.Grid.registerMeta.Sort', dm: '排序依据' }),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          { label: 'null', value: null },
          { label: 'topology', value: 'topology' },
          { label: 'degree', value: 'degree' },
        ],
      },
      default: null,
    },
  };
};

export default registerMeta;
