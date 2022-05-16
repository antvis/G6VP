const registerMeta = context => {
  return {
    sortBy: {
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
    nodeSize: {
      type: 'number',
      title: '节点大小',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 80,
    },
    minNodeSpacing: {
      type: 'number',
      title: '最小间距',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 40,
    },
    equidistant: {
      type: 'boolean',
      title: '是否等间距',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    preventOverlap: {
      type: 'boolean',
      title: '防止重叠',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
  };
};

export default registerMeta;
