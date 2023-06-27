import $i18n from '../../i18n';
const annotationWay = [
  {
    value: 'tag',
    label: $i18n.get({
      id: 'advance.components.GraphAnnotation.registerMeta.MarkNodesAtTheSame',
      dm: '标记节点的同时',
    }),
  },
  {
    value: 'click',
    label: $i18n.get({ id: 'advance.components.GraphAnnotation.registerMeta.WhenYouClickANode', dm: '点击节点标记时' }),
  },
  {
    value: 'tagOnly',
    label: $i18n.get({
      id: 'advance.components.GraphAnnotation.registerMeta.MarkNodesOnlyYouCannot',
      dm: '仅标记节点，不可添加标注',
    }),
  },
  {
    value: 'annotateOnly',
    label: $i18n.get({
      id: 'advance.components.GraphAnnotation.registerMeta.AddOnlyLabelsNotNodes',
      dm: '仅添加标注，不标记节点',
    }),
  },
];

export default () => {
  return {
    annotationWay: {
      title: $i18n.get({ id: 'advance.components.GraphAnnotation.registerMeta.LabelingMethod', dm: '标注方式' }),
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
