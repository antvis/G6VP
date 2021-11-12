const registerMeta = context => {
  const { services } = context;
  const serviceOptions = services.map(c => {
    return {
      value: c.id,
      label: c.id,
    };
  });

  return {
    /** 分类信息 */
    serviceId: {
      name: '数据服务',
      type: 'select',
      default: '',
      options: serviceOptions,
    },
    visible: {
      name: '是否显示',
      type: '',
      default: false,
    },
    initValue: {
      name: '初始查询语句',
      type: 'input',
      default: 'g.V(1)',
    },
    height: {
      name: '高度',
      type: 'input',
      default: 200,
    },
    showGutter: {
      name: '是否显示行号',
      type: '',
      default: false,
    },
  };
};

export default registerMeta;
