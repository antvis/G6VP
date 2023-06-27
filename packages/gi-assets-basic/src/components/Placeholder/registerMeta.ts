import $i18n from '../../i18n';
export default () => {
  return {
    img: {
      type: 'string',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      title: $i18n.get({ id: 'basic.components.Placeholder.registerMeta.ImageAddress', dm: '图片地址' }),
      default: 'https://gw.alipayobjects.com/zos/bmw-prod/db278704-6158-432e-99d2-cc5db457585d.svg',
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
    width: {
      type: 'number',
      title: $i18n.get({ id: 'basic.components.Placeholder.registerMeta.Width', dm: '宽度' }),
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      default: 200,
    },
  };
};
