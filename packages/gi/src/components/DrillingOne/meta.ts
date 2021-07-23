const getMeta = context => {
  const { services } = context;
  const serviceOptions = services.map(c => {
    return {
      value: c.id,
      label: c.id,
    };
  });
  const contianers = [
    { id: 'contextmenu', name: '右键菜单' },
    { id: 'toolbar', name: '工具栏' },
  ];
  const containerOptions = contianers.map(c => {
    return {
      value: c.id,
      label: c.name,
    };
  });
  return {
    /** 分类信息 */
    categoryId: 'components-interaction',
    id: 'DrillingOne',
    type: 'group',
    name: '一度下钻',
    fold: false,
    children: {
      giContainer: {
        name: '集成容器',
        type: 'select',
        default: 'contextmenu',
        options: containerOptions,
      },
      sortkey: {
        name: '选择服务',
        type: 'select',
        default: '',
        options: serviceOptions,
      },
    },
  };
};

export default getMeta;
