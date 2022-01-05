const registerMeta = context => {
  const { services } = context;
  const serviceOptions = services.map(c => {
    return {
      value: c.id,
      label: c.id,
    };
  });
  return {
    hasService: {
      type: 'switch',
      default: false,
      name: '开启数据服务',
    },
    serviceId: {
      name: '数据服务',
      type: 'select',
      default: '',
      options: serviceOptions,
      showInPanel: {
        conditions: [['.hasService', '$eq', true]],
      },
    },
  };
};

export default registerMeta;
