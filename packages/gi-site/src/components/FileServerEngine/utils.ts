import { GraphinData } from '@antv/graphin';

// 因为后续要转化为 JSON 字符串，所以这里不能返回一个函数
export const GIDefaultTrans = (id, source, target, nodeType, edgeType) => `
data => {
  const {combos} = data;
  const nodes = data.nodes.map(n=>{
    return {
      id:'' + n["${id}"],
      nodeType: n["${nodeType}"],
      nodeTypeKeyFromProperties:'${nodeType}',
      data:n
    }
  })
  const edges = data.edges.map(e=>{
    return {
      source:'' + e["${source}"],
      target:'' + e["${target}"],
      edgeType: e["${edgeType}"],
      edgeTypeKeyFromProperties:'${edgeType}',
      data:e
    }
  })
  
  return { nodes, edges,combos }
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
      nodesOptions[key] = { text: `${key}`, value: key };
    });
  }

  if (edges.length !== 0) {
    Object.keys(edges[0]).forEach(key => {
      edgesOptions[key] = { text: `${key}`, value: key };
    });
  }

  return [
    {
      title: 'NodeID (节点唯一标识)',
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
      title: 'NodeType (节点分类)',
      key: 'nodeType',
      dataIndex: 'nodeType',
      valueType: 'select',
      valueEnum: {
        ...nodesOptions,
      },
    },
    {
      title: 'Source (边的起点)',
      key: 'source',
      dataIndex: 'source',
      valueType: 'select',
      valueEnum: {
        ...edgesOptions,
      },
    },
    {
      title: 'Target (边的终点)',
      key: 'target',
      dataIndex: 'target',
      valueType: 'select',
      valueEnum: {
        ...edgesOptions,
      },
    },
    {
      title: 'EdgeType (边的类型)',
      key: 'edgeType',
      dataIndex: 'edgeType',
      valueType: 'select',
      valueEnum: {
        ...edgesOptions,
      },
    },
  ];
};

export const downloadFile = async (mockUrls: string[]) => {
  mockUrls.forEach(item => {
    const url = item;
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.style.height = '0';
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(() => {
      iframe.remove();
    }, 1000);
  });
};
