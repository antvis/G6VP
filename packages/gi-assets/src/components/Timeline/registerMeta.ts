export default () => {
  return {
    GI_CONTAINER_INDEX: {
      name: '排序位置',
      type: 'stepper',
      step: 1,
      min: 0,
      max: 15,
      default: 2,
    },
    isShowTitle: {
      name: '显示名称',
      type: 'switch',
      default: true,
    },
    title: {
      name: '填写名称',
      type: 'text',
      default: '时序分析',
      showInPanel: {
        conditions: [['.isShowTitle', '$eq', true]],
      },
    },
    isShowIcon: {
      name: '显示图标',
      type: 'switch',
      default: true,
    },
    icon: {
      name: '选择图标',
      type: 'text',
      default: 'icon',
      showInPanel: {
        conditions: [['.isShowIcon', '$eq', true]],
      },
    },
  };
};
