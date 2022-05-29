const registerMeta = context => {
  const { schemaData, edgeKeys } = context;

  return {
    mappingKeys: {
      title: '展示文本',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
        options: edgeKeys.map(c => {
          return { label: c, value: c };
        }),
      },
      default: edgeKeys,
    },
    placement: {
      title: '展示位置',
      type: 'Select',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        options: [
          {
            value: 'left',
            label: '左侧',
          },
          {
            value: 'right',
            label: '右侧',
          },
          {
            value: 'top',
            label: '上侧',
          },
          {
            value: 'bottom',
            label: '下侧',
          },
        ],
      },
      default: 'top',
    },
    width: {
      title: '展示宽度',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '200px',
    },
    hasArrow: {
      title: '展示箭头',
      type: 'boolean',
      default: true,
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
  };
};

export default registerMeta;
