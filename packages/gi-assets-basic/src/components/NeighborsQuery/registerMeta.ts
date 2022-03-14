export default context => {
  const { services } = context;
  const serviceOptions = services.map(c => {
    return {
      value: c.id,
      label: c.id,
    };
  });
  return {
    serviceId: {
      name: '列表ID',
      type: 'select',
      default: 'Mock/NeighborsQuery',
      options: serviceOptions,
    },
    degree: {
      name: '选择查询度数',
      type: 'checkbox',
      default: [1, 2, 3],
      options: [
        {
          value: 1,
          label: '一度查询',
        },
        {
          value: 2,
          label: '二度查询',
        },
        {
          value: 3,
          label: '三度查询',
        },
      ],
    },
  };
};
