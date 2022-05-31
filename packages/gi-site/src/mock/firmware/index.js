const data = {
  nodes: [
    // 僵尸网络家族节点
    {
      id: 'pink-botnet', // 僵尸网络家族名称，在[pink_botnet、mirai_botnet、gafgyt_botnet、iot_reaper_botnet、fodcha_botnet、ewdoor_botnet、abc_bot]之间取随机值
      dataType: 'botnet', // 数据类型为固定值：botnet
      legendType: '僵尸网络家族', // 图例类型为固定值：僵尸网络家族
    },
    // 漏洞事件节点
    {
      id: 'CVE-2025-4823', // CVE编号，在[CVE-2025-4823、CVE-2024-2321、CVE-2021-0039、CVE-2022-1215、CVE-2029-3820、CVE-2021-2394]之间取随机值
      dataType: 'cve', // 数据类型为固定值：cve
      legendType: '漏洞事件', // 图例类型为固定值：漏洞事件
    },
    // 单文件节点
    {
      id: 'Tutktunnel', // 文件名称，在[Tutktunnel、tddp、setup.cgi、mainfunction.cgi、libP2PTunnelAPIs.so、libIOTCAPIs.so、DVRRemoteAP.exe、hnap.cgi、busybox]间取随机值
      dataType: 'file', // 数据类型为固定值：file
      legendType: '单文件', // 图例类型为固定值：单文件
      md5: 'c01ca513705bbd528a4b4067cc083d20', // md5，随机md5值
    },
    // 固件节点
    {
      id: 2394, // 固件ID，在1000-9000之间取随机值
      dataType: 'firmware', // 数据类型为固定值：firmware
      legendType: '固件', // 图例类型为固定值：固件
      md5: 'c01ca513705bbd528a4b4067cc083d20', // md5，随机md5值
      manu: 'D-Link', // 厂商，在[D-Link、TP-Link、Netgear、QNAP、Cisco、ASUS、Trendnet、Juniper、Synology、Draytek、ABB]中取随机值
      device_type: '摄像头', // 设备类型，在[摄像头、路由器、防火墙、网络存储设备、DVR设备、NVR设备、光猫、安防设备、智能电表、AP设备]中取随机值
      name: 'xxxx.bin', // 固件名称，在[xxxx.bin、xxxx.tar、xxxx.zip、xxxx.gz]之间取随机值
    },

    // 设备制造商节点
    {
      id: 'D-Link', // 厂商，在[D-Link、TP-Link、Netgear、QNAP、Cisco、ASUS、Trendnet、Juniper、Synology、Draytek、ABB]中取随机值"",
      dataType: 'manu', // 数据类型为固定值：manu
      legendType: '设备制造商', // 图例类型为固定值：设备制造商
    },

    // 在线设备资产节点，主要包含属性为IP、经纬度、所属单位、所属地区等
    {
      id: '192.168.1.1', // mock IP地址
      dataType: 'online_assets', // 数据类型为固定值：online_assets
      legendType: '在线设备资产', // 图例类型为固定值：在线设备资产
      data: {
        id: 'xx公司', // 在[xx公司、xx局、xx集团、xx电厂、xx油田、xx机场、xx火车站]之间取随机值
        type: 'entity',
        longitude: 102.2956, // 经纬度随机值，用于在地图上展示；考虑到展示效果，应该一小片区域内的随机地址，比如美国纽约范围内的经纬度地址；
        latitude: 25.3455,
      },
      country: '美国', // 国家，在[美国、日本、法国、英国、韩国、越南、印度、中国、俄罗斯、加拿大、新加坡]之间取随机值
      province: '亚利桑那', // 省份/州，在[亚利桑那、加利福尼亚、佛罗里达、华盛顿、北海道、冲绳、广东、四川、首尔、釜山、比哈尔邦、北方邦、艾伯塔]之间取随机值
      city: '多伦多', // 城市，在[多伦多、渥太华、横滨、大阪、名古屋、郑州、芝加哥、洛杉矶、波士顿、底特律、费城、伯明翰、巴斯、格拉斯哥]之间取随机值
      device_type: '摄像头', // 设备类型，在[摄像头、路由器、防火墙、网络存储设备、DVR设备、NVR设备、光猫、安防设备、智能电表、AP设备]中取随机值
      port: 22, // 开放端口，在[80、22、8080、9000、443、23、3306、9100、9200、8081、8443、8089、554、4567]中取随机值
    },
    // 国家节点
    {
      id: '美国', // 国家，在[美国、日本、法国、英国、韩国、越南、印度、中国、俄罗斯、加拿大、新加坡]之间取随机值
      dataType: 'country', // 数据类型为固定值：country
      legendType: '国家', // 图例类型为固定值：国家
    },
  ],
  edges: [
    // 僵尸网络家族-漏洞事件的边
    {
      source: 'pink-botnet', // 僵尸网络家族节点的ID
      target: 'CVE-2025-4823', // 漏洞事件节点的ID
      edgeType: 'botnet_belong',
    },
    // 漏洞事件-单文件的边
    {
      source: 'CVE-2025-4823', // 漏洞事件节点的ID
      target: 'Tutktunnel', // 单文件节点的ID
      edgeType: 'vuln_belong',
    },
    // 单文件-固件的边
    {
      source: 'Tutktunnel', // 单文件节点的ID
      target: '2394', // 固件节点的ID
      edgeType: 'firm_belong',
    },
    // 固件-设备制造商的边
    {
      source: '2394', // 固件节点的ID
      target: 'D-Link', // 设备制造商节点的ID
      edgeType: 'manu_belong',
    },
    // 设备制造商-国家的边
    {
      source: 'D-Link', // 设备制造商节点的ID
      target: '美国', // 国家节点的ID
      edgeType: 'manu_country_belong',
    },
    // 固件-在线设备资产的边
    {
      source: '2394', // 固件节点的ID
      target: '192.168.1.1', // 在线设备资产节点的ID
      edgeType: 'assets_belong',
    },
    // 在线设备资产-国家的边
    {
      source: '192.168.1.1', // 在线设备资产节点的ID
      target: '美国', // 国家节点的ID
      edgeType: 'assets_country_belong',
    },
  ],
};
