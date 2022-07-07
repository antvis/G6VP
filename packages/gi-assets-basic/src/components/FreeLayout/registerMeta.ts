// import { extra } from "@alipay/graphinsight";
// const { deepClone, GI_CONTAINER_METAS } = extra;
// const metas = deepClone(GI_CONTAINER_METAS);

// metas.height.default = "calc(100vh - 120px)";
// metas.width.default = "450px";
// metas.offset.default = [0, 61];
// metas.placement.default = "LB";

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
    bottomHeight: {
      title: '下侧高度',
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
