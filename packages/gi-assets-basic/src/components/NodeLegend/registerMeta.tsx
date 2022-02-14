const registerMeta = context => {
  const { data } = context;
  let keys = ['id'];
  try {
    keys = Object.keys(data.nodes[0]?.data || {});
  } catch (error) {
    console.warn(error);
  }

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
    textColor: {
      name: '字体颜色',
      type: 'fill',
      default: '#ddd',
    },
  };
};

export default registerMeta;
