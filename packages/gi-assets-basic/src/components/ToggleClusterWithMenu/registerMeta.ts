import $i18n from '../../i18n';
export default () => {
  return {
    isReLayout: {
      title: $i18n.get({ id: 'basic.components.ToggleClusterWithMenu.registerMeta.ReLayout', dm: '重新布局' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    degree: {
      title: $i18n.get({
        id: 'basic.components.ToggleClusterWithMenu.registerMeta.DegreesOfFoldingNodes',
        dm: '收起节点度数',
      }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        min: 1,
      },
      default: 1,
    },
  };
};
