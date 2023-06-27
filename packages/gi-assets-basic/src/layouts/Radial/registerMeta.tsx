import $i18n from '../../i18n';
const registerMeta = context => {
  return {
    unitRadius: {
      type: 'number',
      title: $i18n.get({ id: 'basic.layouts.Radial.registerMeta.LevelDistance', dm: '层级距离' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 200,
    },
    linkDistance: {
      type: 'number',
      title: $i18n.get({ id: 'basic.layouts.Radial.registerMeta.SideLength', dm: '边长' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 200,
    },
    nodeSize: {
      type: 'number',
      title: $i18n.get({ id: 'basic.layouts.Radial.registerMeta.NodeSize', dm: '节点大小' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 60,
    },
    focusNode: {
      type: 'string',
      title: $i18n.get({ id: 'basic.layouts.Radial.registerMeta.CentralNode', dm: '中心节点' }),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
    },
    nodeSpacing: {
      type: 'number',
      title: $i18n.get({ id: 'basic.layouts.Radial.registerMeta.NodeSpacing', dm: '节点间距' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {},
      default: 30,
    },
    preventOverlap: {
      type: 'boolean',
      title: $i18n.get({ id: 'basic.layouts.Radial.registerMeta.PreventOverlap', dm: '防止重叠' }),
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    strictRadial: {
      type: 'boolean',
      title: $i18n.get({ id: 'basic.layouts.Radial.registerMeta.StrictRadiation', dm: '严格辐射' }),
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
  };
};

export default registerMeta;
