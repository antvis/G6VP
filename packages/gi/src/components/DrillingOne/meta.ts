const getMeta = context => {
  const { data, keys = ['id', 'type'], services } = context;
  const options = services.map(c => {
    return {
      value: c.id,
      label: c.id,
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
      sortkey: {
        name: '选择服务',
        type: 'select',
        default: '',
        options,
      },
    },
  };
};

export default getMeta;
