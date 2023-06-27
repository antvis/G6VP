import $i18n from '../../i18n';
const registerMeta = context => {
  return {
    radius: {
      type: 'number',
      title: $i18n.get({ id: 'basic.layouts.Circular.registerMeta.Radius', dm: '半径' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 300,
    },
    divisions: {
      type: 'number',
      title: $i18n.get({ id: 'basic.layouts.Circular.registerMeta.NumberOfSegments', dm: '分段数' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 1,
    },
    ordering: {
      type: 'string',
      title: $i18n.get({ id: 'basic.layouts.Circular.registerMeta.Sort', dm: '排序依据' }),
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
    preventOverlap: {
      type: 'switch',
      title: $i18n.get({ id: 'basic.layouts.Circular.registerMeta.PreventOverlap', dm: '防止重叠' }),
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
  };
};

export default registerMeta;
