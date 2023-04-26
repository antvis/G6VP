export default () => {
  return {
    hop: {
      title: '跳数',
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
