export const nodeColumns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'nodeType',
    dataIndex: 'nodeType',
    key: 'nodeType',
  },
  {
    title: 'data',
    dataIndex: 'data',
    key: 'data',
    render: data => <span>{JSON.stringify(data)}</span>,
  },
];

export const edgeColumns = [
  {
    title: 'edgeType',
    dataIndex: 'edgeType',
    key: 'edgeType',
  },
  {
    title: 'source',
    dataIndex: 'source',
    key: 'source',
  },
  {
    title: 'target',
    dataIndex: 'target',
    key: 'target',
  },
  {
    title: 'data',
    dataIndex: 'data',
    key: 'data',
    render: data => <span>{JSON.stringify(data)}</span>,
  },
];

export const translist = [
  {
    key: 'edit',
    id: 'id',
    source: 'source',
    target: 'target',
  },
];

export const GIDefaultTrans = (id, source, target, nodeType, edgeType) => `
data => {
  const nodes = data.nodes.map(n=>{
    return {
      id:'' + n.${id},
      nodeType: n.${nodeType},
      nodeTypeKeyFromProperties:'${nodeType}',
      data:n
    }
  })
  const edges = data.edges.map(e=>{
    return {
      source:'' + e.${source},
      target:'' + e.${target},
      edgeType: e.${edgeType},
      edgeTypeKeyFromProperties:'${edgeType}',
      data:e
    }
  })
  return { nodes, edges }
}
`;

export const getMockData = () => {
  return {
    nodes: [],
    edges: [],
  };
};

export const getOptions = data => {
  const { nodes, edges } = data;
  let nodesOptions = {};
  let edgesOptions = {};
  Object.keys(nodes[0]).forEach(key => {
    nodesOptions[key] = { text: `${key}` };
  });

  Object.keys(edges[0]).forEach(key => {
    edgesOptions[key] = { text: `${key}` };
  });

  return [
    {
      title: 'Node ID',
      key: 'id',
      dataIndex: 'id',
      valueType: 'select',
      valueEnum: {
        ...nodesOptions,
      },
      formItemProps: {
        rules: [
          {
            required: true,
            whitespace: true,
            message: '此项是必填项',
          },
        ],
      },
    },
    {
      title: 'Node Type',
      key: 'nodeType',
      dataIndex: 'nodeType',
      valueType: 'select',
      valueEnum: {
        ...nodesOptions,
      },
    },
    {
      title: 'Edge Type',
      key: 'edgeType',
      dataIndex: 'edgeType',
      valueType: 'select',
      valueEnum: {
        ...edgesOptions,
      },
    },
    {
      title: 'Source',
      key: 'source',
      dataIndex: 'source',
      valueType: 'select',
      valueEnum: {
        ...edgesOptions,
      },
    },
    {
      title: 'Target',
      key: 'target',
      dataIndex: 'target',
      valueType: 'select',
      valueEnum: {
        ...edgesOptions,
      },
    },
  ];
};
