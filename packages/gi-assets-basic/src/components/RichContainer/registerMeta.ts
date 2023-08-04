const registerMeta = context => {
  const { GIAC_CONTENT_ITEMS = [], GIAC_ITEMS = [] } = context;
  return {
    containers: [
      {
        id: 'navbar',
        name: '顶部导航',
        required: true,
        GI_CONTAINER: {
          title: '集成组件',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_ITEMS,
          default: [],
        },
      },
      {
        id: 'view-mode',
        name: '模式展示',
        required: true,
        GI_CONTAINER: {
          title: '集成组件',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
      },
      {
        id: 'data-query',
        name: '数据查询',
        required: true,
        GI_CONTAINER: {
          title: '集成组件',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
      },
      {
        id: 'canvas-operator',
        name: '画布操作',
        required: true,
        GI_CONTAINER: {
          title: '集成组件',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_ITEMS,
          default: [],
        },
      },
      {
        id: 'styling-setting',
        name: '布局样式',
        required: true,
        GI_CONTAINER: {
          title: '集成组件',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
      },
    ],
  };
};
export default registerMeta;
