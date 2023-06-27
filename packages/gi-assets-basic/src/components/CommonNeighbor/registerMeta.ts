import $i18n from '../../i18n';
export default () => {
  return {
    hop: {
      title: $i18n.get({ id: 'basic.components.CommonNeighbor.registerMeta.NumberOfHops', dm: '跳数' }),
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
