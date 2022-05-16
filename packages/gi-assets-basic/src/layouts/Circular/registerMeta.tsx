const registerMeta = context => {
  return {
    radius: {
      type: 'number',
      title: '半径',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 300,
    },
    divisions: {
      type: 'number',
      title: '分段数',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 1,
    },
    ordering: {
      type: 'string',
      title: '排序依据',
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
      title: '防止重叠',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
  };
};

export default registerMeta;
