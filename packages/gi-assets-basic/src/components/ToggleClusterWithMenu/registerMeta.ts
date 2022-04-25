export default () => {
  return {
    isReLayout: {
      name: '重新布局',
      type: 'switch',
      default: false,
    },
    degree: {
      name: '收起节点度数',
      type: 'stepper',
      step: 1,
      min: 1,
      default: 1,
    },
  };
};
