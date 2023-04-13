const registerMeta = context => {
  const { GIAC_MENU_ITEMS = [] } = context;
  GIAC_MENU_ITEMS.map(item => {
    return item.value;
  });
  return {
    /** 分类信息 */
    GI_CONTAINER: {
      title: '可集成组件',
      type: 'string',
      enum: GIAC_MENU_ITEMS,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      default: GIAC_MENU_ITEMS.map(item => {
        return item.value;
      }),
    },
  };
};

export default registerMeta;
