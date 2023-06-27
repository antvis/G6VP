import $i18n from '../../i18n';
export default () => {
  return {
    minZoom: {
      title: $i18n.get({ id: 'basic.components.ZoomStatus.registerMeta.MinimumZoom', dm: '最小缩放' }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 0.6,
    },
    statusName: {
      title: $i18n.get({ id: 'basic.components.ZoomStatus.registerMeta.StatusName', dm: '状态名' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'minZoom',
    },
  };
};
