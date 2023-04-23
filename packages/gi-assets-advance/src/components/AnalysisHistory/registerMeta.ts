const registerMeta = () => {
  return {
    placement: {
      title: '放置方位',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            value: 'top',
            label: '顶部',
          },
          {
            value: 'bottom',
            label: '底部',
          },
        ],
      },
      default: 'bottom',
    },
    height: {
      title: '历史栏高度',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 40,
    },
  };
};

export default registerMeta;
