const registerMeta = () => {
  const schema = {
    imageUrl: {
      title: "版权图片",
      type: "string",
      "x-component": "Input",
      "x-decorator": "FormItem",
      default: "",
    },
    width: {
      title: "宽度",
      type: "number",
      "x-decorator": "FormItem",
      "x-component": "NumberPicker",
      default: 100,
    },
    height: {
      title: "高度",
      type: "number",
      "x-decorator": "FormItem",
      "x-component": "NumberPicker",
      default: 100,
    },
    offset: {
      title: "偏移量",
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Offset",
      "x-component-props": {
        min: 0,
        max: 400,
      },
      default: [100, 20],
    },
  };

  return schema;
};

export default registerMeta;
