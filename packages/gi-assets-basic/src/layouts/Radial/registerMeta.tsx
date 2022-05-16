const registerMeta = context => {
  return {
    unitRadius: {
      type: 'number',
      title: '层级距离',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 200,
    },
    linkDistance: {
      type: 'number',
      title: '边长',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 200,
    },
    nodeSize: {
      type: 'number',
      title: '节点大小',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 60,
    },
    focusNode: {
      type: 'string',
      title: '中心节点',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
    },
    nodeSpacing: {
      type: 'number',
      title: '节点间距',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {},
      default: 30,
    },
    preventOverlap: {
      type: 'boolean',
      title: '防止重叠',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    strictRadial: {
      type: 'boolean',
      title: '严格辐射',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
  };
};

export default registerMeta;
