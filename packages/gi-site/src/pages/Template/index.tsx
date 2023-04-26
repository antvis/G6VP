import { BarsOutlined, DeploymentUnitOutlined, EnvironmentOutlined, GiftOutlined } from '@ant-design/icons';
import * as React from 'react';
import SegmentedTabs from '../../components/SegmentedTabs';
import List from './List';

interface TemplatesProps {}

const Templates: React.FunctionComponent<TemplatesProps> = props => {
  return (
    <SegmentedTabs
      defaultActive="graph"
      items={[
        {
          key: 'my',
          icon: <BarsOutlined />,
          label: '我的模版',
          children: <List type="my" />,
        },
        {
          key: 'graph',
          icon: <DeploymentUnitOutlined />,
          label: '关系图模版',
          children: <List type="graph" />,
        },
        {
          key: 'geo',
          icon: <EnvironmentOutlined />,
          label: '地图模版',
          children: <></>,
        },
        {
          key: 'vip',
          icon: <GiftOutlined />,
          label: 'VIP 模版',
          children: <></>,
        },
      ]}
    />
  );
};

export default Templates;
