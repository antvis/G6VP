const getMeta = context => {
  const { data, keys = ['id', 'type'] } = context;
  const options = keys.map(c => {
    return {
      value: c,
      label: c,
    };
  });
  return {
    /** 分类信息 */
    categoryId: 'components-analysis',
    id: 'NodeLegend',

    type: 'group', //这个可以不写
    fold: false, // 这个可以不写
    name: '节点图例',
    children: {
      sortkey: {
        name: '映射字段',
        type: 'select',
        default: 'type',
        options,
      },
    },
  };
};

export default getMeta;
