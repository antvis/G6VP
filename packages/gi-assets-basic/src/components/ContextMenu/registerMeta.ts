const registerMeta = context => {
  const { GI_MENU_CONTAINER_INDEXS = [] } = context;
  return {
    /** 分类信息 */
    GI_CONTAINER: {
      title: '集成组件',
      type: 'string',
      enum: GI_MENU_CONTAINER_INDEXS,
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
