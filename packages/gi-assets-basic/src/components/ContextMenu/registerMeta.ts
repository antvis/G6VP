const registerMeta = context => {
  const { GIAC_MENU_ITEMS = [] } = context;
  return {
    /** 分类信息 */
    GI_CONTAINER: {
      title: '集成组件',
      type: 'string',
      enum: GIAC_MENU_ITEMS,
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
