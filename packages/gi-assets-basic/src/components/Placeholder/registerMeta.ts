import $i18n from '../../i18n';
export default () => {
  return {
    img: {
      type: 'string',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      title: $i18n.get({ id: 'basic.components.Placeholder.registerMeta.ImageAddress', dm: '图片地址' }),
      default: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*1BGfQ78mW4kAAAAAAAAAAAAADmJ7AQ/original',
    },
    text: {
      type: 'string',
      title: $i18n.get({ id: 'basic.components.Placeholder.registerMeta.Text', dm: '文本' }),
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      default: $i18n.get({
        id: 'basic.components.Placeholder.registerMeta.StartYourGraphAnalysisApplication',
        dm: '开始你的图分析应用～',
      }),
    },
    textColor: {
      type: 'string',
      title: $i18n.get({ id: 'basic.components.Placeholder.registerMeta.TextColor', dm: '文本颜色' }),
      'x-component': 'ColorInput',
      'x-decorator': 'FormItem',
      default: '#999',
    },
    spacing: {
      type: 'number',
      title: $i18n.get({ id: 'basic.components.Placeholder.registerMeta.Spacing', dm: '间距' }),
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      default: 8,
    },
    width: {
      type: 'number',
      title: $i18n.get({ id: 'basic.components.Placeholder.registerMeta.Width', dm: '宽度' }),
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      default: 200,
    },
  };
};
