export default () => {
  return {
    img: {
      type: 'string',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      title: '图片地址',
      default: 'https://gw.alipayobjects.com/zos/bmw-prod/db278704-6158-432e-99d2-cc5db457585d.svg',
    },
    text: {
      type: 'string',
      title: '文本',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      default: '开始你的图分析应用～',
    },
    width: {
      type: 'number',
      title: '宽度',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      default: 200,
    },
  };
};
