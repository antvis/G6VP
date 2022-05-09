export default () => {
  return {
    isReLayout: {
      title: '重新布局',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    degree: {
      title: '收起节点度数',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        min: 1,
      },
      default: 1,
    },
  };
};
