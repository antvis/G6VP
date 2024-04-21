import { BarsOutlined, DeploymentUnitOutlined, EnvironmentOutlined, GiftOutlined } from '@ant-design/icons';
import * as React from 'react';
import SegmentedTabs from '../../components/SegmentedTabs';
import List from './List';
import $i18n from '../../i18n';

interface TemplatesProps {}

const Templates: React.FunctionComponent<TemplatesProps> = props => {
  return (
    <SegmentedTabs
      defaultActive="graph"
      items={[
        {
          key: 'my',
          icon: <BarsOutlined />,
          label: $i18n.get({ id: 'gi-site.pages.Template.MyTemplate', dm: '我的模版' }),
          children: <List type="my" />,
        },
        {
          key: 'graph',
          icon: <DeploymentUnitOutlined />,
          label: $i18n.get({ id: 'gi-site.pages.Template.DiagramTemplate', dm: '关系图模版' }),
          children: <List type="graph" />,
        },
        // {
        //   key: 'geo',
        //   icon: <EnvironmentOutlined />,
        //   label: $i18n.get({ id: 'gi-site.pages.Template.MapTemplate', dm: '地图模版' }),
        //   children: <></>,
        // },
        // {
        //   key: 'vip',
        //   icon: <GiftOutlined />,
        //   label: $i18n.get({ id: 'gi-site.pages.Template.VipTemplate', dm: 'VIP 模版' }),
        //   children: <></>,
        // },
      ]}
    />
  );
};

export default Templates;
