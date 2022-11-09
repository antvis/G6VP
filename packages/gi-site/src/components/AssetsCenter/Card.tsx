import { CheckCard } from '@alipay/tech-ui';
import { Icon } from '@antv/gi-sdk';
import { Avatar, Tag } from 'antd';
import * as React from 'react';

export interface AssetCardProps {
  name: string;
  pkg: string;
  version: string;
  icon: string;
  desc: string;
  id: string;
}

const COLOR_MAP = {
  basic: 'green',
  advance: 'volcano',
  scene: 'purple',
  undefined: '#f50',
};

const AssetCard: React.FunctionComponent<AssetCardProps> = props => {
  const { name: AssetName, version, icon = 'icon-robot', desc, id: AssetId } = props;
  const pkg = props.pkg?.replace('@antv/gi-assets-', '') || '';

  return (
    <div>
      <CheckCard
        bordered={false}
        className="assetsCardStyle"
        title={
          <div
            style={{
              width: '230px',
              display: 'flex',
              justifyContent: 'space-between',
              color: 'var(--text-color)',
            }}
          >
            {AssetName}
            <Tag
              color={COLOR_MAP[pkg]}
              style={{
                fontSize: '12px',
                transform: 'scale(0.8)',
              }}
            >
              {pkg}@{version}
            </Tag>
          </div>
        }
        avatar={
          <Avatar
            style={{
              //  backgroundColor: '#EAEEFC',
              background: 'var(--primary-color-opacity-1)',
              color: '#3056E3',
              fontSize: '34px',
            }}
            icon={<Icon type={icon} />}
            size={50}
          ></Avatar>
        }
        description={<div className="asset-detail">{desc}</div>}
        value={AssetId}
      />
    </div>
  );
};

export default AssetCard;
