import { Icon, useContext } from '@antv/gi-sdk';
import { Tabs } from 'antd';
import * as React from 'react';
import './index.less';
import useComponents from './useComponents';

export interface UadLayoutProps {
  topItems: any[];
  sideItems: any[];
  tabPosition: 'left' | 'right' | 'top' | 'bottom';
  height: number;
}

const UadLayout: React.FunctionComponent<UadLayoutProps> = props => {
  const { children, tabPosition, height } = props;
  const context = useContext();
  const { topItems, sideItems } = props;
  const { config, assets } = context;
  const ComponentCfgMap = config.components.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr,
    };
  }, {});
  const QueryContent = useComponents(topItems, ComponentCfgMap, assets.components);
  const SideContent = useComponents(sideItems, ComponentCfgMap, assets.components);
  const items = [
    { label: <Icon type="icon-layout-concentric" />, key: 'sdk', children: children, forceRender: true }, // 务必填写 key
    ...SideContent.map(item => {
      return {
        label: <Icon type={item.icon} />,
        key: item.id,
        children: item.children,
      };
    }),
  ];
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ height: `${height}px`, borderBottom: 'var(--primary-border)' }}>
        {' '}
        {QueryContent.map(item => item.children)}
      </div>
      <div style={{ width: '100%', height: `calc(100% - ${height}px` }}>
        <Tabs items={items} tabPosition={tabPosition} style={{ height: '100%' }} className="gi-query-layout-tabs" />
      </div>
    </div>
  );
};

export default UadLayout;
