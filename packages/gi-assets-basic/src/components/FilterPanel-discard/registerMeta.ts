const registerMeta = context => {
  const { data } = context;
  const nodeKeys = Object.keys(data.nodes[0].data);

  const nodeOptions = nodeKeys.map(c => {
    return {
      value: c,
      label: c,
    };
  });
  const edgeKeys = Object.keys(data.edges[0].data);
  const edgeOptions = edgeKeys.map(c => {
    return {
      value: c,
      label: c,
    };
  });
  return {
    node: {
      name: '节点',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        sortKey: {
          name: '映射字段',
          type: 'select',
          default: 'id',
          options: nodeOptions,
        },
      },
    },
    edge: {
      name: '边',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        sortKey: {
          name: '映射字段',
          type: 'select',
          default: 'source',
          options: edgeOptions,
        },
      },
    },
  };
};

export default registerMeta;
