const registerMeta = context => {
  try {
    const { keys } = context;

    const numberKeys = keys.filter(key => key.type === 'number').map(c => c.id);
    const numberOptions = numberKeys.map(c => {
      return { label: c, value: c };
    });

    return {
      type: 'object',
      properties: {
        donut: {
          title: '环展示',
          type: 'array',
          //todo: 显示文本属性根据 data 生成
          enum: numberOptions,
          default: [],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
        },
        donutColors: {
          title: '环色彩',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: '',
        },
        size: {
          title: '环大小',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: undefined,
        },
        label: {
          title: '文本',
          type: 'array',
          enum: keys.map(c => {
            return {
              label: `${c.id} (${c.type})`,
              value: c.id,
            };
          }),
          default: [],
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
