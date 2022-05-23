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
      nodeType: 'Whois_Phone',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/Whois_Phone.csv',
    },
    whoisEmail: {
      nodeType: 'Whois_Email',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/Whois_Email.csv',
    },
    whoisName: {
      nodeType: 'Whois_Name',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/Whois_Name.csv',
    },
    domain: {
      nodeType: 'Domain',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/Domain.csv',
    },
    ip: {
      nodeType: 'IP',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/IP.csv',
    },
  },
  edgeFiles: {
    r_asn_IP_ASN: {
      edgeType: 'r_asn',
      sourceNodeType: 'IP',
      targetNodeType: 'ASN',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_asn_IP_ASN.csv',
    },
    r_cert_chain_Cert_Cert: {
      edgeType: 'r_cert_chain',
      sourceNodeType: 'Cert',
      targetNodeType: 'Cert',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_cert_chain_Cert_Cert.csv',
    },
    r_cert_Domain_Cert: {
      edgeType: 'r_cert',
      sourceNodeType: 'Domain',
      targetNodeType: 'Cert',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_cert_Domain_Cert.csv',
    },
    // 第二列
    r_cidr_IP_IP_CIDR: {
      edgeType: 'r_cidr',
      sourceNodeType: 'IP',
      targetNodeType: 'IP_C',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_cidr_IP_IP_CIDR.csv',
    },
    r_cname_Domain_Domain: {
      edgeType: 'r_cname',
      sourceNodeType: 'Domain',
      targetNodeType: 'Domain',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_cname_Domain_Domain.csv',
    },
    r_dns_a_Domain_IP: {
      edgeType: 'r_dns_a',
      sourceNodeType: 'Domain',
      targetNodeType: 'IP',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_dns_a_Domain_IP.csv',
    },
    r_request_jump_Domain_Domain: {
      edgeType: 'r_request_jump',
      sourceNodeType: 'Domain',
      targetNodeType: 'Domain',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_request_jump_Domain_Domain.csv',
    },
    // 第三列
    r_subdomain_Domain_Domain: {
      edgeType: 'r_subdomain',
      sourceNodeType: 'Domain',
      targetNodeType: 'Domain',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_subdomain_Domain_Domain.csv',
    },
    r_whois_email_Domain_Whois_Email: {
      edgeType: 'r_whois_email',
      sourceNodeType: 'Domain',
      targetNodeType: 'Whois_Email',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_whois_email_Domain_Whois_Email.csv',
    },
    r_whois_name_Domain_Domain: {
      edgeType: 'r_whois_name',
      sourceNodeType: 'Domain',
      targetNodeType: 'Domain',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_whois_name_Domain_Domain.csv',
    },
    r_whois_name_Domain_Whois_Name: {
      edgeType: 'r_whois_name',
      sourceNodeType: 'Domain',
      targetNodeType: 'Whois_Name',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_whois_name_Domain_Whois_Name.csv',
    },
    // 第四列
    r_whois_name_Domain_Whois_Phone: {
      edgeType: 'r_whois_name',
      sourceNodeType: 'Domain',
      targetNodeType: 'Whois_Phone',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_whois_name_Domain_Whois_Phone.csv',
    },
    r_whois_name_Whois_Phone_Domain: {
      edgeType: 'r_whois_name',
      sourceNodeType: 'Whois_Phone',
      targetNodeType: 'Domain',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_whois_name_Whois_Phone_Domain.csv',
    },
    r_whois_phone_Domain_Whois_Phone: {
      edgeType: 'r_whois_phone',
      sourceNodeType: 'Domain',
      targetNodeType: 'Whois_Phone',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_whois_phone_Domain_Whois_Phone.csv',
    },
    r_whois_phone_Whois_Name_Domain: {
      edgeType: 'r_whois_phone',
      sourceNodeType: 'Whois_Name',
      targetNodeType: 'Domain',
      filePath: '/home/graphscope/.gshttpserver/dataset/vis/r_whois_phone_Whois_Name_Domain.csv',
    },
  },
};

const NODE_ID = 'id';
const SRC_FIELD = 'src_id';
const DST_FIELD = 'dst_id';
export const LoadChinaVisDataSource = {
  nodes: [
    {
      label: ChinaVisDataPathMapping.nodeFiles.asn.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.asn.filePath,
      id_field: NODE_ID,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.nodeFiles.cert.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.cert.filePath,
      id_field: NODE_ID,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.nodeFiles.domain.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.domain.filePath,
      id_field: NODE_ID,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.nodeFiles.whoisName.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.whoisName.filePath,
      id_field: NODE_ID,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.nodeFiles.ip.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.ip.filePath,
      id_field: NODE_ID,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.nodeFiles.ipC.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.ipC.filePath,
      id_field: NODE_ID,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.nodeFiles.whoisEmail.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.whoisEmail.filePath,
      id_field: NODE_ID,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.nodeFiles.whoisPhone.nodeType,
      location: ChinaVisDataPathMapping.nodeFiles.whoisPhone.filePath,
      id_field: NODE_ID,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
  ],
  edges: [
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_asn_IP_ASN.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_asn_IP_ASN.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_asn_IP_ASN.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_asn_IP_ASN.targetNodeType,
      srcField: SRC_FIELD,
      dstField: DST_FIELD,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_cert_Domain_Cert.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_cert_Domain_Cert.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_cert_Domain_Cert.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_cert_Domain_Cert.targetNodeType,
      srcField: SRC_FIELD,
      dstField: DST_FIELD,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_cert_chain_Cert_Cert.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_cert_chain_Cert_Cert.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_cert_chain_Cert_Cert.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_cert_chain_Cert_Cert.targetNodeType,
      srcField: SRC_FIELD,
      dstField: DST_FIELD,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_cidr_IP_IP_CIDR.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_cidr_IP_IP_CIDR.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_cidr_IP_IP_CIDR.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_cidr_IP_IP_CIDR.targetNodeType,
      srcField: SRC_FIELD,
      dstField: DST_FIELD,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_cname_Domain_Domain.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_cname_Domain_Domain.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_cname_Domain_Domain.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_cname_Domain_Domain.targetNodeType,
      srcField: SRC_FIELD,
      dstField: DST_FIELD,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_dns_a_Domain_IP.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_dns_a_Domain_IP.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_dns_a_Domain_IP.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_dns_a_Domain_IP.targetNodeType,
      srcField: SRC_FIELD,
      dstField: DST_FIELD,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_request_jump_Domain_Domain.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_request_jump_Domain_Domain.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_request_jump_Domain_Domain.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_request_jump_Domain_Domain.targetNodeType,
      srcField: SRC_FIELD,
      dstField: DST_FIELD,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_subdomain_Domain_Domain.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_subdomain_Domain_Domain.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_subdomain_Domain_Domain.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_subdomain_Domain_Domain.targetNodeType,
      srcField: SRC_FIELD,
      dstField: DST_FIELD,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_whois_email_Domain_Whois_Email.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_whois_email_Domain_Whois_Email.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_email_Domain_Whois_Email.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_email_Domain_Whois_Email.targetNodeType,
      srcField: SRC_FIELD,
      dstField: DST_FIELD,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Domain_Domain.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Domain_Domain.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Domain_Domain.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Domain_Domain.targetNodeType,
      srcField: SRC_FIELD,
      dstField: DST_FIELD,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Domain_Whois_Name.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Domain_Whois_Name.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Domain_Whois_Name.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Domain_Whois_Name.targetNodeType,
      srcField: SRC_FIELD,
      dstField: DST_FIELD,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Domain_Whois_Phone.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Domain_Whois_Phone.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Domain_Whois_Phone.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Domain_Whois_Phone.targetNodeType,
      srcField: SRC_FIELD,
      dstField: DST_FIELD,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Whois_Phone_Domain.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Whois_Phone_Domain.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Whois_Phone_Domain.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_name_Whois_Phone_Domain.targetNodeType,
      srcField: SRC_FIELD,
      dstField: DST_FIELD,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_whois_phone_Domain_Whois_Phone.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_whois_phone_Domain_Whois_Phone.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_phone_Domain_Whois_Phone.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_phone_Domain_Whois_Phone.targetNodeType,
      srcField: SRC_FIELD,
      dstField: DST_FIELD,
      config: {
        header_row: true,
        delimiter: ',',
      },
    },
    {
      label: ChinaVisDataPathMapping.edgeFiles.r_whois_phone_Whois_Name_Domain.edgeType,
      location: ChinaVisDataPathMapping.edgeFiles.r_whois_phone_Whois_Name_Domain.filePath,
      srcLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_phone_Whois_Name_Domain.sourceNodeType,
      dstLabel: ChinaVisDataPathMapping.edgeFiles.r_whois_phone_Whois_Name_Domain.targetNodeType,
      srcField: SRC_FIELD,
      dstField: DST_FIELD,
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
