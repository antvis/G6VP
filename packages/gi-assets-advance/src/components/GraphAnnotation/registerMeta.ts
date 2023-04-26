const annotationWay = [
  {
    value: 'tag',
    label: '标记节点的同时',
  },
  {
    value: 'click',
    label: '点击节点标记时',
  },
  {
    value: 'tagOnly',
    label: '仅标记节点，不可添加标注',
  },
  {
    value: 'annotateOnly',
    label: '仅添加标注，不标记节点',
  },
];

export default () => {
  return {
    annotationWay: {
      title: '标注方式',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: annotationWay,
      },
      default: 'tag',
    },
  };
};
