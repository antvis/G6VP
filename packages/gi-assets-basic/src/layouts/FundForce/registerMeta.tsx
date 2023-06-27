import $i18n from '../../i18n';
const registerMeta = ({ keys, schemaData }) => {
  const nodeProperties = schemaData.nodes.reduce((acc, cur) => {
    return {
      ...acc,
      ...cur.properties,
    };
  }, {});

  const options = keys.filter(k => nodeProperties[k] === 'number').map(k => ({ label: k, value: k }));
  return {
    income: {
      title: $i18n.get({ id: 'basic.layouts.FundForce.registerMeta.InflowFunds', dm: '流入资金' }),
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        options,
      },
      default: options[0]?.value,
    },
    outcome: {
      title: $i18n.get({ id: 'basic.layouts.FundForce.registerMeta.OutflowFunds', dm: '流出资金' }),
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        options,
      },
      default: options[0]?.value,
    },
    isLog: {
      title: $i18n.get({ id: 'basic.layouts.FundForce.registerMeta.LogMapping', dm: 'log 映射' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    multiple: {
      title: $i18n.get({ id: 'basic.layouts.FundForce.registerMeta.MultipleMapping', dm: '倍数映射' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '0.1',
    },
  };
};

export default registerMeta;
