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
      title: '流入资金',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        options,
      },
      default: options[0]?.value,
    },
    outcome: {
      title: '流出资金',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        options,
      },
      default: options[0]?.value,
    },
    isLog: { title: 'log 映射', type: 'boolean', 'x-decorator': 'FormItem', 'x-component': 'Switch', default: true },
    multiple: {
      title: '倍数映射',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '0.1',
    },
  };
};

export default registerMeta;
