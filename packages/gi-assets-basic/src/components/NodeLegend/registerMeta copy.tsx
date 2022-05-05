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
    placement: {
      name: '组件位置',
      type: 'select',
      default: 'LB',
      options: [
        {
          value: 'LT',
          label: '左上',
        },
        {
          value: 'RT',
          label: '右上',
        },
        {
          value: 'LB',
          label: '左下',
        },
        {
          value: 'RB',
          label: '右下',
        },
      ],
    },
    offset: {
      name: '偏移距离',
      type: 'Offset',
      min: 0,
      max: 400,
      default: [100, 20],
    },
  };
};

export default registerMeta;
