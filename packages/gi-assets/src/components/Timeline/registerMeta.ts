export default () => {
  return {
    GI_CONTAINER_INDEX: {
      name: '容器中位置',
      type: 'stepper',
      step: 1,
      min: 0,
      max: 15,
      default: 2,
    },
    hasDivider: {
      name: '分隔符',
      type: 'switch',
      default: false,
    },
    color: {
      name: '提示颜色',
      type: 'fill',
      default: '#87d068',
    },
    defaultVisible: {
      name: '是否显示',
      type: 'switch',
      default: false,
    },
  };
};
