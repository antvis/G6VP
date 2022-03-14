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
      name: '数据服务',
      type: 'select',
      default: 'Mock/PropertiesPanel',
      options: serviceOptions,
    },
  };
};

export default registerMeta;
