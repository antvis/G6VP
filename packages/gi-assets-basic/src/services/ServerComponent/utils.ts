import { GraphinData } from '@antv/graphin';
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

export const getOptions = (data: GraphinData) => {
  const { nodes, edges = [] } = data;

  let nodesOptions = {};
  let edgesOptions = {};
  if (nodes.length !== 0) {
    Object.keys(nodes[0]).forEach(key => {
      nodesOptions[key] = { text: `${key}` };
    });
  }

  if (edges.length !== 0) {
    Object.keys(edges[0]).forEach(key => {
      edgesOptions[key] = { text: `${key}` };
    });
  }

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
