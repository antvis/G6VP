import $i18n from '../../i18n';
const registerMeta = context => {
  try {
    const { data, keys } = context;

    const labelOptions = keys.map(c => {
      return {
        value: c,
        label: c,
      };
    });
    return {
      label: {
        name: $i18n.get({ id: 'advance.elements.ClusterNode.registerMeta.Label', dm: '标签' }),
        type: 'group',
        enableHide: false,
        fold: false,
        children: {
          showlabel: {
            name: $i18n.get({ id: 'advance.elements.ClusterNode.registerMeta.Switch', dm: '开关' }),
            type: 'switch',
            default: true,
            statusText: true,
          },
          mappingKey: {
            name: $i18n.get({ id: 'advance.elements.ClusterNode.registerMeta.MappingField', dm: '映射字段' }),
            type: 'select',
            useFont: true,
            default: 'type',
            showInPanel: {
              conditions: [['label.showlabel', '$eq', true]],
            },
            options: labelOptions,
          },
        },
      },
    };
  } catch (error) {}
};

export default registerMeta;
