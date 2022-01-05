const registerMeta = context => {
  return {
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
    nodeSize: {
      type: 'slider',
      caption: '节点大小',
      default: 15,
      min: 0,
      max: 200,
      step: 1,
    },
    minNodeSpacing: {
      type: 'slider',
      caption: '最小间距',
      default: 10,
      min: 5,
      max: 50,
      step: 1,
    },
    equidistant: {
      type: 'switch',
      caption: '是否等间距',
      default: false,
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
