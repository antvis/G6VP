import $i18n from '../../i18n';
const registerMeta = context => {
  const { schemaData, keys } = context;

  return {
    mappingKeys: {
      title: $i18n.get({ id: 'basic.components.Tooltip.registerMeta.Text', dm: '文本' }),
      type: 'string',
      'x-decorator': 'FormItem',
      // 'x-component': 'GroupSelect',
      // 'x-component-props': {
      //   mode: 'multiple',
      //   schemaData: schemaData.nodes,
      // },
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
        options: keys.map(c => {
          return { label: c, value: c };
        }),
      },
      default: keys,
    },
    placement: {
      title: $i18n.get({ id: 'basic.components.Tooltip.registerMeta.Location', dm: '位置' }),
      type: 'Select',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        options: [
          {
            value: 'left',
            label: $i18n.get({ id: 'basic.components.Tooltip.registerMeta.LeftSide', dm: '左侧' }),
          },
          {
            value: 'right',
            label: $i18n.get({ id: 'basic.components.Tooltip.registerMeta.RightSide', dm: '右侧' }),
          },
          {
            value: 'top',
            label: $i18n.get({ id: 'basic.components.Tooltip.registerMeta.UpperSide', dm: '上侧' }),
          },
          {
            value: 'bottom',
            label: $i18n.get({ id: 'basic.components.Tooltip.registerMeta.LowerSide', dm: '下侧' }),
          },
        ],
      },
      default: 'top',
    },
    width: {
      title: $i18n.get({ id: 'basic.components.Tooltip.registerMeta.Width', dm: '宽度' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '200px',
    },
    hasArrow: {
      title: $i18n.get({ id: 'basic.components.Tooltip.registerMeta.Arrow', dm: '箭头' }),
      type: 'boolean',
      default: true,
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
  };
};

export default registerMeta;
