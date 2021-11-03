const registerMeta = context => {
  return {
    radius: {
      type: 'slider',
      caption: '半径',
      default: 100,
      min: 5,
      max: 2500,
      step: 1,
    },
    divisions: {
      type: 'slider',
      caption: '分段数',
      default: 1,
      step: 1,
      min: 1,
      max: 10,
    },
    ordering: {
      type: 'select',
      caption: '排序依据',
      default: null,
      options: [
        { label: '请选择', value: null },
        { label: 'topology', value: 'topology' },
        { label: 'degree', value: 'degree' },
      ],
    },
    preventOverlap: {
      type: 'switch',
      caption: '防止重叠',
      default: true,
      statusText: false,
    },
  };
};

export default registerMeta;
