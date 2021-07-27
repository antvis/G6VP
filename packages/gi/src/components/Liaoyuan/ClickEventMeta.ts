const getMeta = context => {
  const { services } = context;
  const serviceOptions = services.map(c => {
    return {
      value: c.id,
      label: c.id,
    };
  });
  return {
    /** 分类信息 */
    categoryId: 'components-interaction',
    id: 'Liaoyuan-Click-Event-Node',
    type: 'group',
    name: '点击「事件」节点',
    fold: false,
    children: {
      serviceId: {
        name: '数据服务',
        type: 'select',
        default: '',
        options: serviceOptions,
      },
    },
  };
};

export default getMeta;
