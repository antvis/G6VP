const registerMeta = context => {
  return {
    rows: {
      type: 'number',
      title: '网格行数',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
    },
    cols: {
      type: 'slider',
      title: '网格列数',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
    },
    sortBy: {
      type: 'select',
      title: '排序依据',
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
