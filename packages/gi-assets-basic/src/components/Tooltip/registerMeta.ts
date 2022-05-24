const registerMeta = context => {
  const { schemaData, keys } = context;

  return {
    mappingKeys: {
      title: '文本',
      type: 'string',
      'x-decorator': 'FormItem',
      // 'x-component': 'GroupSelect',
      // 'x-component-props': {
      //   mode: 'multiple',
      //   schemaData: schemaData.nodes,
      // },
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
        options: keys.map(c => {
          return { label: c, value: c };
        }),
      },
      default: keys,
    },
    placement: {
      title: '位置',
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
      title: '宽度',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '200px',
    },
    hasArrow: {
      title: '箭头',
      type: 'boolean',
      default: true,
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
  };
};

export default registerMeta;
