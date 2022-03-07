export default () => {
  return {
    img: {
      type: 'text',
      name: '图片地址',
      default: 'https://gw.alipayobjects.com/zos/bmw-prod/db278704-6158-432e-99d2-cc5db457585d.svg',
    },
    text: {
      type: 'text',
      name: '文本',
      default: '开始你的图分析应用～',
    },
    width: {
      type: 'number',
      name: '宽度',
      default: 200,
    },
  };
};
