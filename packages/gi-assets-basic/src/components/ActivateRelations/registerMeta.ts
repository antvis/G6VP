const registerMeta = context => {
  return {
    /** 分类信息 */
    enableNodeHover: {
      title: '节点悬停',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      type: 'boolean',
      default: true,
    },
    enableEdgeHover: {
      title: '边悬停',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      type: 'boolean',
      default: true,
    },
    enable: {
      title: '启用关联',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      type: 'boolean',
      default: true,
    },
    trigger: {
      title: '触发方式',
      type: 'string',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        options: [
          {
            label: '鼠标点击',
            value: 'click',
          },
          {
            label: '鼠标移入',
            value: 'mouseenter',
          },
        ],
      },
      default: 'click',
    },
    upstreamDegree: {
      title: '上游度数',
      type: 'number',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      default: 1,
      'x-component-props': {
        disable: true,
      },
    },
    downstreamDegree: {
      title: '下游度数',
      type: 'number',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      default: 1,
      'x-component-props': {
        disable: true,
      },
    },
    multiSelectEnabled: {
      title: '允许多选',
      type: 'string',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      default: false,
      'x-component-props': {
        disable: true,
      },
    },
    modifierKey: {
      title: '多选组合键, 按下键盘输入组合键，支持Alt, Control, Shift, Meta',
      type: 'string',
      'x-component': 'ModifierPicker',
      'x-decorator': 'FormItem',
      default: 'alt',
      'x-component-props': {
        disable: true,
      },
    },
  };
};

export default registerMeta;
