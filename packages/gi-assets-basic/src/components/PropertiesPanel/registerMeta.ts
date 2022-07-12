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

    defaultiStatistic: {
      title: '默认展示统计信息',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    title: {
      title: '标题',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '属性面板',
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
            value: 'LB',
          },
          {
            label: '右部',
            value: 'RT',
          },
          {
            label: '上部',
            value: 'LT',
          },
          {
            label: '底部',
            value: 'RB',
          },
        ],
      },
      default: 'LB',
    },
    width: {
      title: '宽度',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '500px',
    },
    height: {
      title: '高度',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'calc(100% - 80px)',
    },
    offset: {
      title: '偏移距离',
      type: 'array',
      'x-decorator': 'FormItem',
      'x-component': 'Offset',
      default: [10, 10],
    },
    animate: {
      title: '抽屉动画',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
  };
};

export default registerMeta;
