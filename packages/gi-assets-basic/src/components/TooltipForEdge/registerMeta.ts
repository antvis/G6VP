import $i18n from '../../i18n';
const registerMeta = context => {
  const { schemaData, edgeKeys } = context;

  return {
    mappingKeys: {
      title: $i18n.get({ id: 'basic.components.TooltipForEdge.registerMeta.DisplayText', dm: '展示文本' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
        options: edgeKeys.map(c => {
          return { label: c, value: c };
        }),
      },
      default: edgeKeys,
    },
    placement: {
      title: $i18n.get({ id: 'basic.components.TooltipForEdge.registerMeta.DisplayLocation', dm: '展示位置' }),
      type: 'Select',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        options: [
          {
            value: 'left',
            label: $i18n.get({ id: 'basic.components.TooltipForEdge.registerMeta.LeftSide', dm: '左侧' }),
          },
          {
            value: 'right',
            label: $i18n.get({ id: 'basic.components.TooltipForEdge.registerMeta.RightSide', dm: '右侧' }),
          },
          {
            value: 'top',
            label: $i18n.get({ id: 'basic.components.TooltipForEdge.registerMeta.UpperSide', dm: '上侧' }),
          },
          {
            value: 'bottom',
            label: $i18n.get({ id: 'basic.components.TooltipForEdge.registerMeta.LowerSide', dm: '下侧' }),
          },
        ],
      },
      default: 'top',
    },
    width: {
      title: $i18n.get({ id: 'basic.components.TooltipForEdge.registerMeta.DisplayWidth', dm: '展示宽度' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '200px',
    },
    hasArrow: {
      title: $i18n.get({ id: 'basic.components.TooltipForEdge.registerMeta.ShowArrow', dm: '展示箭头' }),
      type: 'boolean',
      default: true,
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
  };
};

export default registerMeta;
