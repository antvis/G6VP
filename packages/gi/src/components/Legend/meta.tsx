const getMeta = context => {
  const { data, allKeys = ['id', 'type'] } = context;
  const options = allKeys.map(c => {
    return {
      value: c,
      label: c,
    };
  });
  return {
    sortkey: {
      name: '映射字段',
      type: 'select',
      default: 'type',
      options,
    },
  };
};

export default getMeta;
