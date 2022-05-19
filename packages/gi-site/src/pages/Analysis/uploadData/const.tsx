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
  const { nodes, edges = [] } = data;

  let nodesOptions = {};
  let edgesOptions = {};
  Object.keys(nodes[0]).forEach(key => {
    nodesOptions[key] = { text: `${key}` };
  });

  if (edges.length === 0) {
    edgesOptions = {};
  } else {
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

export const DefaultGraphScopeNodeFilePath = '/home/graphscope/dongze.ldz/alibaba/gstest/property/p2p-31_property_v_0';
export const DefaultGraphScopeEdgeFilePath = '/home/graphscope/dongze.ldz/alibaba/gstest/property/p2p-31_property_e_0';

// /home/graphscope/.gshttpserver/dataset/vis/
const ChinaVisDataPathMapping = {
  nodeFiles: {
    asn: {
      nodeType: 'ASN',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/ASN.csv',
    },
    cert: {
      nodeType: 'Cert',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/Cert.csv',
    },
    ipC: {
      nodeType: 'IP_C',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/IP_C.csv',
    },
    whoisPhone: {
      nodeType: 'Cert',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/Whois_Phone.csv',
    },
    whoisEmail: {
      nodeType: 'ASN',
      filePath: '/home/graphscope/.gshttpserver/dataset/Whois_Email.csv',
    },
    whoisName: {
      nodeType: 'Cert',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/Whois_Name.csv',
    },
    domain: {
      nodeType: 'ASN',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/Domain.csv',
    },
    ip: {
      nodeType: 'Cert',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/IP.csv',
    },
  },
  edgeFiles: {
    r_cert_chain: {
      edgeType: 'r_cert_chain',
      sourceNodeType: 'Cert',
      targetNodeType: 'Cert',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_cert_chain.csv',
    },
    r_cert: {
      edgeType: 'r_cert',
      sourceNodeType: 'Cert',
      targetNodeType: 'Domain',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_cert.csv',
    },
    r_subdomain: {
      edgeType: 'r_subdomain',
      sourceNodeType: 'Domain',
      targetNodeType: 'Domain',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_subdomain.csv',
    },
    r_request_jump: {
      edgeType: 'r_request_jump',
      sourceNodeType: 'Domain',
      targetNodeType: 'Domain',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_request_jump.csv',
    },
    r_cname: {
      edgeType: 'r_cname',
      sourceNodeType: 'Domain',
      targetNodeType: 'Domain',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_cname.csv',
    },
    r_dns_a: {
      edgeType: 'r_dns_a',
      sourceNodeType: 'Domain',
      targetNodeType: 'IP',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_dns_a.csv',
    },
    r_cidr: {
      edgeType: 'r_cidr',
      sourceNodeType: 'IP',
      targetNodeType: 'IP_C',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_cidr.csv',
    },
    r_asn: {
      edgeType: 'r_asn',
      sourceNodeType: 'IP',
      targetNodeType: 'ASN',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_asn.csv',
    },
    r_whois_name: {
      edgeType: 'r_whois_name',
      sourceNodeType: 'Domain',
      targetNodeType: 'Whois_Name',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_whois_name.csv',
    },
    r_whois_phone: {
      edgeType: 'r_whois_phone',
      sourceNodeType: 'Domain',
      targetNodeType: 'Whois_Phone',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_whois_phone.csv',
    },
    r_whois_email: {
      edgeType: 'r_whois_email',
      sourceNodeType: 'Domain',
      targetNodeType: 'Whois_Email',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_whois_email.csv',
    },
  },
};

export const LoadChinaVisDataSource = {
  nodes: [
    {
      label: ChinaVisDataPathMapping.nodeFiles.asn.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.asn.filePath,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.nodeFiles.cert.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.cert.filePath,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.nodeFiles.domain.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.domain.filePath,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.nodeFiles.whoisName.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.whoisName.filePath,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.nodeFiles.ip.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.ip.filePath,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.nodeFiles.ipC.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.ipC.filePath,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.nodeFiles.whoisEmail.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.whoisEmail.filePath,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.nodeFiles.whoisPhone.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.whoisPhone.filePath,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
  ],
  edges: [
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_asn.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_asn.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_asn.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_asn.targetNodeType,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_cert.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_cert.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_cert.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_cert.targetNodeType,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_cert_chain.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_cert_chain.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_cert_chain.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_cert_chain.targetNodeType,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_cidr.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_cidr.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_cidr.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_cidr.targetNodeType,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_cname.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_cname.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_cname.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_cname.targetNodeType,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_dns_a.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_dns_a.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_dns_a.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_dns_a.targetNodeType,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_request_jump.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_request_jump.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_request_jump.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_request_jump.targetNodeType,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_subdomain.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_subdomain.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_subdomain.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_subdomain.targetNodeType,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_whois_email.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_whois_email.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_email.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_email.targetNodeType,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_whois_name.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_whois_name.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_name.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_name.targetNodeType,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_whois_phone.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_whois_phone.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_phone.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_phone.targetNodeType,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
  ],
};

export const ChinaVisNodeColumns = [
  {
    title: '节点类型',
    dataIndex: 'nodeType',
    key: 'nodeType',
  },
  {
    title: '说明',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '数量',
    dataIndex: 'count',
    key: 'count',
  },
  {
    title: '重要程度',
    dataIndex: 'isImp',
    key: 'isImp',
  },
];

export const ChinaVisNodeData = [
  {
    nodeType: 'Domain',
    description: '网站域名',
    count: '200万',
    isImp: '非常重要',
  },
  {
    nodeType: 'IP',
    description: '网站的IP地址',
    count: '20万',
    isImp: '非常重要',
  },
  {
    nodeType: 'Cert',
    description: '网站用的SSL安全证书',
    count: '13万',
    isImp: '非常重要',
  },
  {
    nodeType: 'Whois_Name',
    description: '网站域名的注册人姓名',
    count: '1.8万',
    isImp: '重要',
  },
  {
    nodeType: 'Whois_Phone',
    description: '网站域名的注册人电话',
    count: '0.2万',
    isImp: '重要',
  },
  {
    nodeType: 'Whois_Email',
    description: '网站域名的注册人邮箱',
    count: '0.4万',
    isImp: '重要',
  },
  {
    nodeType: 'IP_C',
    description: 'IP的C段',
    count: '0.6万',
    isImp: '一般',
  },
  {
    nodeType: 'ASN',
    description: 'IP的自治域',
    count: '0.03万',
    isImp: '一般',
  },
];

export const ChinaVisEdgeColumns = [
  {
    title: '边',
    dataIndex: 'edgeType',
    key: 'nodeType',
  },
  {
    title: '说明',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '数量',
    dataIndex: 'count',
    key: 'count',
  },
  {
    title: '关联强度',
    dataIndex: 'isImp',
    key: 'isImp',
  },
];

export const ChinaVisEdgeData = [
  {
    edgeType: 'r_cert',
    description: '域名使用的安全证书',
    count: '23万',
    isImp: '很强',
  },
  {
    edgeType: 'r_subdomain',
    description: '域名拥有的子域名',
    count: '45万',
    isImp: '很强',
  },
  {
    edgeType: 'r_request_jump',
    description: '域名间跳转关系',
    count: '0.06万',
    isImp: '很强',
  },
  {
    edgeType: 'r_dns_a',
    description: '域名对应的IP地址',
    count: '205万',
    isImp: '很强',
  },
  {
    edgeType: 'r_whois_name',
    description: '域名的注册人姓名',
    count: '10万',
    isImp: '较强',
  },
  {
    edgeType: 'r_whois_email',
    description: '域名的注册人邮箱',
    count: '2.8万',
    isImp: '较强',
  },
  {
    edgeType: 'r_whois_phone',
    description: '域名的注册人电话',
    count: '1.9万',
    isImp: '较强',
  },
  {
    edgeType: 'r_cert_chain',
    description: '证书的证书链关系',
    count: '1.5万',
    isImp: '一般',
  },
  {
    edgeType: 'r_cname',
    description: '域名对应的别名',
    count: '13万',
    isImp: '一般',
  },
  {
    edgeType: 'r_asn',
    description: 'IP所属的自治域',
    count: '6.9万',
    isImp: '较弱',
  },
  {
    edgeType: 'r_cidr',
    description: 'IP所对应的C段',
    count: '17万',
    isImp: '较弱',
  },
];
