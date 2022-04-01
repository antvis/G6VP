const registerMeta = context => {
  try {
    const { data, keys } = context;
    const firstNode = data.nodes[0]?.data;
    const numberKeys = Object.keys(firstNode).filter(key => {
      return typeof firstNode[key] === 'number';
    });
    const numberOptions = numberKeys.map(c => {
      return { label: c, value: c };
    });
    return {
      type: 'object',
      collapsed: false,
      properties: {
        donut: {
          title: '环展示',
          type: 'array',
          //todo: 显示文本属性根据 data 生成
          enum: numberOptions,
          default: numberKeys,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
        },
        label: {
          title: '文本',
          type: 'array',
          //todo: 显示文本属性根据 data 生成
          enum: keys.map(c => {
            return { label: c, value: c };
          }),
          default: keys,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
        },
      },
    };
  } catch (error) {
    return {};
  }
};

export default registerMeta;
