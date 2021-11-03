const registerMeta = context => {
  return {
    rankdir: {
      type: 'select',
      caption: '布局方向',
      default: 'TB',
      options: [
        { label: '自上而下', value: 'TB' },
        { label: '自下而上', value: 'BT' },
        { label: '自左而右', value: 'LR' },
        { label: '自右而左', value: 'RL' },
      ],
    },
    align: {
      type: 'select',
      caption: '对齐方式',
      default: null,
      options: [
        { label: '请选择', value: null },
        { label: 'UL', value: 'UL' },
        { label: 'UR', value: 'UR' },
        { label: 'DL', value: 'DL' },
        { label: 'DR', value: 'DR' },
      ],
    },
    nodesep: {
      type: 'slider',
      caption: '节点间距',
      default: 10,
      min: 1,
      max: 200,
      step: 1,
    },
    ranksep: {
      type: 'slider',
      caption: '层间距',
      default: 10,
      min: 1,
      max: 200,
      step: 1,
    },
  };
};

export default registerMeta;
