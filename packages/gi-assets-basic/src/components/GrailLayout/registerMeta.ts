const registerMeta = context => {
  const { GIAC_CONTENT_ITEMS = [] } = context;

  const schema = {
    containers: [
      {
        id: 'GI_CONTAINER_LEFT',
        name: '左侧容器',
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
        visible: {
          title: '默认展开左侧容器',
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: true,
        },
        width: {
          title: '左侧宽度',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {},
          default: '400px',
        },
      },
      {
        id: 'GI_CONTAINER_RIGHT',
        name: '右侧容器',
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
        visible: {
          title: '默认展开右侧容器',
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: true,
        },
        width: {
          title: '右侧宽度',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {},
          default: '400px',
        },
      },
      {
        id: 'GI_CONTAINER_BOTTOM',
        name: '底部容器',
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
        visible: {
          title: '默认展开底部容器',
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: true,
        },
        height: {
          title: '底部高度',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {},
          default: '400px',
        },
      },
      {
        id: 'GI_CONTAINER_TOP',
        name: '顶部容器',
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
        visible: {
          title: '默认展开顶部容器',
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: false,
        },
        height: {
          title: '顶部高度',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {},
          default: '200px',
        },
      },
    ],
  };

  return schema;
};

export default registerMeta;
