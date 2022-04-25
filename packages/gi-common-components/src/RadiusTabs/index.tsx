import { Tabs } from 'antd';
import * as React from 'react';
import './index.less';

const { TabPane } = Tabs;

interface RadiusTabsProps {
  children: React.ReactNode;
  defaultActiveKey: string;
}

const RadiusTabs: React.FunctionComponent<RadiusTabsProps> & { TabPane: typeof RadiusTabPane } = props => {
  const { children, defaultActiveKey } = props;
  return (
    <div>
      <Tabs defaultActiveKey={defaultActiveKey} centered id="gi-switch-elements-tab">
        {children}
      </Tabs>
    </div>
  );
};
interface RadiusTabPaneProps {
  children: React.ReactNode;
  tab: string;
}
const RadiusTabPane = (props: RadiusTabPaneProps) => {
  const { children, tab } = props;
  return <TabPane tab={<div className="tab-title">{tab}</div>}>{children}</TabPane>;
};
RadiusTabs.TabPane = RadiusTabPane;

export default RadiusTabs;
