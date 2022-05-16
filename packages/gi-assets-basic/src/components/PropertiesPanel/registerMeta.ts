const registerMeta = context => {
  const { services } = context;
  const serviceOptions = services.map(c => {
    return {
      value: c.id,
      label: c.id,
    };
  });
  return {
    serviceId: {
      title: '数据服务',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: serviceOptions,
      },
      default: 'Mock/PropertiesPanel',
    },
    placement: {
      title: '展示方位',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            label: '左部',
            value: 'left',
          },
          {
            label: '右部',
            value: 'right',
          },
          {
            label: '上部',
            value: 'top',
          },
          {
            label: '底部',
            value: 'bottom',
          },
        ],
      },
      default: 'right',
    },

    width: {
      title: '展示方位',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 356,
    },
  };
};

export default registerMeta;
