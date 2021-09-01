const registerMeta = context => {
  const { services } = context;
  const serviceOptions = services.map(c => {
    return {
      value: c.id,
      label: c.id,
    };
  });
  const userOptions = ['xiaosuo', 'pmuens', 'veris-pr', 'yecol', 'savage69kr', 'piggybox'].map(c => {
    return {
      value: c,
      label: c,
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
    currentUser: {
      name: '当前用户',
      type: 'select',
      default: 'xiaosuo',
      options: userOptions,
    },
  };
};

export default registerMeta;
