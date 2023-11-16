const registerMeta = context => {
  return {
    activeIds: {
      title: '激活资产',
      type: 'string',
      enum: [],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      default: [],
    },
  };
};

export default registerMeta;
