import { Select, Typography } from 'antd';
import React from 'react';

const EnvInfo = ({ IS_ONLINE_ENV }) => {
  if (IS_ONLINE_ENV) {
    return (
      <div style={{ width: '500px' }}>
        <p>
          当前您处于 GraphInsight <Typography.Text type="success">「线上环境」 </Typography.Text>
        </p>
        <p>✅ 支持域内用户，数据存放在云端，可根据权限进行查看与分享</p>
        <p>✅ 支持域内用户，根据权限，新增/查看/使用 业务沉淀的图分析资产</p>
        <p>✅ 支持域内用户，使用 ODPS 数据源，支持多款图计算引擎</p>
      </div>
    );
  }
  return (
    <div style={{ width: '500px' }}>
      <p>
        当前您处于 G6VP <Typography.Text type="success">「本地环境」 </Typography.Text>
      </p>
      <p>✅ 数据安全：所有的数据（上传数据，画布操作配置）均存在你的本地浏览器 IndexDB 中，请放心使用</p>
      <p>✅ 支持规模：本地上传文件无限制，但是目前仅支持10万节点内的网络分析，请提前处理好数据。</p>
      <p>❌ 在线分享：数据在用户本地，因此不支持在线URL分享</p>
      <p>✅ 项目分享：提供项目下载与恢复功能，可以通过项目文件进行分享</p>
    </div>
  );
};

const DataModeCard = () => {
  const defaultValue = localStorage.getItem('GI_SITE_ENV') || 'OFFLINE';
  const handleChange = value => {
    console.log(value);
    localStorage.setItem('GI_SITE_ENV', value);
    window.location.reload();
  };

  return (
    // <Popover content={<EnvInfo IS_ONLINE_ENV={!GI_SITE.IS_OFFLINE} />} title="环境说明" trigger="hover">
    // {/* <Button icon={<DatabaseOutlined />}>{title}</Button> */}
    <Select
      defaultValue={defaultValue}
      style={{ width: 120, marginRight: '5px' }}
      onChange={handleChange}
      options={[
        {
          value: 'OFFLINE',
          label: '本地存储',
        },
        {
          value: 'ONLINE',
          label: '云端存储',
        },
      ]}
    />
    // </Popover>
  );
};
export default DataModeCard;
