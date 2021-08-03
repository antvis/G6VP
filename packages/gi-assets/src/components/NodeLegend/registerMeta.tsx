const registerMeta = context => {
  const { data, keys = ['id', 'type'] } = context;
  const options = keys.map(c => {
    return {
      value: c,
      label: c,
    };
  });
  return {
    /** 分类信息 */
    sortKey: {
      name: '映射字段',
      type: 'select',
      default: 'type',
      options,
    },
  };
};

export default registerMeta;
