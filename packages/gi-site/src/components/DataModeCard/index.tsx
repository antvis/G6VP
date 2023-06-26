import { Select, Typography } from 'antd';
import React from 'react';
import { GI_SITE } from '../../services/const';
import $i18n from '../../i18n';
import './index.less';

const EnvInfo = ({ IS_ONLINE_ENV }) => {
  if (IS_ONLINE_ENV) {
    return (
      <div style={{ width: '500px' }}>
        <p>
          {$i18n.get({
            id: 'gi-site.components.DataModeCard.YouAreCurrentlyInGraphinsight',
            dm: '当前您处于 GraphInsight',
          })}
          <Typography.Text type="success">
            {$i18n.get({ id: 'gi-site.components.DataModeCard.OnlineEnvironment', dm: '「线上环境」' })}
          </Typography.Text>
        </p>
        <p>
          {$i18n.get({
            id: 'gi-site.components.DataModeCard.SupportsUsersInTheDomain',
            dm: '✅ 支持域内用户，数据存放在云端，可根据权限进行查看与分享',
          })}
        </p>
        <p>
          {$i18n.get({
            id: 'gi-site.components.DataModeCard.SupportsUsersInTheDomain.1',
            dm: '✅ 支持域内用户，根据权限，新增/查看/使用 业务沉淀的图分析资产',
          })}
        </p>
        <p>
          {$i18n.get({
            id: 'gi-site.components.DataModeCard.SupportsDomainUsersOdpsData',
            dm: '✅ 支持域内用户，使用 ODPS 数据源，支持多款图计算引擎',
          })}
        </p>
      </div>
    );
  }
  return (
    <div style={{ width: '500px' }}>
      <p>
        {$i18n.get({ id: 'gi-site.components.DataModeCard.YouAreCurrentlyInG', dm: '当前您处于 G6VP' })}
        <Typography.Text type="success">
          {$i18n.get({ id: 'gi-site.components.DataModeCard.LocalEnvironment', dm: '「本地环境」' })}
        </Typography.Text>
      </p>
      <p>
        {$i18n.get({
          id: 'gi-site.components.DataModeCard.DataSecurityAllDataUpload',
          dm: '✅ 数据安全：所有的数据（上传数据，画布操作配置）均存在你的本地浏览器 IndexDB 中，请放心使用',
        })}
      </p>
      <p>
        {$i18n.get({
          id: 'gi-site.components.DataModeCard.SupportedScaleThereIsNo',
          dm: '✅ 支持规模：本地上传文件无限制，但是目前仅支持10万节点内的网络分析，请提前处理好数据。',
        })}
      </p>
      <p>
        {$i18n.get({
          id: 'gi-site.components.DataModeCard.OnlineSharingDataIsLocal',
          dm: '❌ 在线分享：数据在用户本地，因此不支持在线URL分享',
        })}
      </p>
      <p>
        {$i18n.get({
          id: 'gi-site.components.DataModeCard.ProjectSharingProvidesProjectDownload',
          dm: '✅ 项目分享：提供项目下载与恢复功能，可以通过项目文件进行分享',
        })}
      </p>
    </div>
  );
};

const DataModeCard = () => {
  const defaultValue = GI_SITE.IS_OFFLINE ? 'OFFLINE' : 'ONLINE';
  const handleChange = value => {
    console.log(value);
    localStorage.setItem('GI_SITE_ENV', value);
    window.location.reload();
  };

  return (
    // <Popover content={<EnvInfo IS_ONLINE_ENV={!GI_SITE.IS_OFFLINE} />} title="环境说明" trigger="hover">
    // {/* <Button icon={<DatabaseOutlined />}>{title}</Button> */}
    <Select
      className="gi-select"
      defaultValue={defaultValue}
      style={{ width: 'fit-content', marginRight: '5px' }}
      onChange={handleChange}
      options={[
        {
          value: 'OFFLINE',
          label: $i18n.get({ id: 'gi-site.components.DataModeCard.LocalStorage', dm: '本地存储' }),
        },
        {
          value: 'ONLINE',
          label: $i18n.get({ id: 'gi-site.components.DataModeCard.CloudStorage', dm: '云端存储' }),
        },
      ]}
    />

    // </Popover>
  );
};
export default DataModeCard;
