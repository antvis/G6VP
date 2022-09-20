// 这里根据不同环境换成相应的地址
// 测试环境：https://storehouse.test.alipay.net
// 预发环境：https://graphinsight-pre.alipay.com
// 生产环境：http://graphinsight-api.antgroup-inc.cn

// TODO：这里的地址可以做成可配置的，让用户自己选择环境
export const HTTP_SERVICE_URL = 'http://127.0.0.1:7001';

export const DefaultGraphScopeNodeFilePath = '/home/graphscope/.gshttpserver/dataset/vis/p2p-31_property_v_0';
export const DefaultGraphScopeEdgeFilePath = '/home/graphscope/.gshttpserver/dataset/vis/p2p-31_property_e_0';

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
