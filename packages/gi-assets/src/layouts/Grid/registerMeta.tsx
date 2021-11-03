const registerMeta = context => {
  return {
    rows: {
      type: 'slider',
      caption: '网格行数',
      min: 1,
      max: 15,
      step: 1,
    },
    cols: {
      type: 'slider',
      caption: '网格列数',
      min: 1,
      max: 15,
      step: 1,
    },
    sortBy: {
      type: 'select',
      caption: '排序依据',
      useFont: true,
      default: null,
      options: [
        { label: '请选择', value: null },
        { label: 'topology', value: 'topology' },
        { label: 'degree', value: 'degree' },
      ],
    },
  };
};

export default registerMeta;
