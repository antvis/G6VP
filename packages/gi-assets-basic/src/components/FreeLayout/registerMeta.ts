const registerMeta = (context) => {
  const { GIAC_CONTENT_ITEMS = [] } = context;

  const schema = {
    GI_CONTAINER_LEFT: {
      title: "左侧组件",
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Select",
      "x-component-props": {
        mode: "multiple",
      },
      enum: GIAC_CONTENT_ITEMS,
      default: [],
    },
    leftVisible: {
      title: "显示左侧容器",
      type: "boolean",
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    leftWidth: {
      title: '左侧宽度',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {},
      default: '400px',
    },
    GI_CONTAINER_RIGHT: {
      title: "右侧组件",
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Select",
      "x-component-props": {
        mode: "multiple",
      },
      enum: GIAC_CONTENT_ITEMS,
      default: [],
    },
    rightVisible: {
      title: "显示右侧容器",
      type: "boolean",
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    rightWidth: {
      title: '右侧宽度',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {},
      default: '400px',
    },
    GI_CONTAINER_BOTTOM: {
      title: "下侧组件",
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Select",
      "x-component-props": {
        mode: "multiple",
      },
      enum: GIAC_CONTENT_ITEMS,
      default: [],
    },
    bottomVisible: {
      title: "显示底部容器",
      type: "boolean",
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    bottomHeight: {
      title: '底部高度',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {},
      default: '400px',
    },
  };

  return schema;
};

export default registerMeta;
