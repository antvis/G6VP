import React from 'react';

const ChinaVisDataPanel = () => {
  return (
    <div style={{ marginTop: 16 }}>
      <p>
        默认使用ChinaVis 赛道1{' '}
        <a href="http://chinavis.org/2022/challenge.html" target="_blank">
          数据安全可视分析
        </a>
        的点边数据，文件基本信息如下
      </p>
      <p>点文件名称：Node.csv</p>
      <p>边文件：Link.csv</p>
      <p>测试数据共包括 237 万个与黑灰产相关的网络资产（节点）和 328 万条资产关联关系</p>
      <p>共包括 8 种类型的节点，分别为：Domain、IP、Cert、Whois_Name、Whois_Phone、Whois_Email、IP_C、ASN</p>
      <p>
        共包括 11
        种类型的边，分别为：r_cert、r_subdomain、r_request_jump、r_dns_a、r_whois_name、r_whois_email、r_whois_phone、r_cert_chain、r_cname、r_asn、r_cidr
      </p>
    </div>
  );
};

export default ChinaVisDataPanel;
