const registerMeta = context => {
  try {
    const { data, keys } = context;
    const firstNode = data.nodes[0]?.data;
    const numberKeys = Object.keys(firstNode).filter(key => {
      return typeof firstNode[key] === 'number';
    });
    return {
      type: 'object',
      collapsed: false,
      properties: {
        donut: {
          title: '环展示',
          type: 'array',
          widget: 'multiSelect',
          enum: numberKeys,
          items: {
            type: 'string',
          },
          default: numberKeys,
        },
        label: {
          title: '文本',
          type: 'array',
          enum: keys,
          items: {
            type: 'string',
          },
          default: ['id'],
          widget: 'multiSelect',
        },
      },
    };
  } catch (error) {
    return {};
  }
};

export default registerMeta;
