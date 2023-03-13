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
  padding: string;
}

const UadLayout: React.FunctionComponent<UadLayoutProps> = props => {
  const { children, tabPosition, height } = props;
  const context = useContext();
  const { topItems, sideItems, padding } = props;
  const { config, assets } = context;
  const { data: graphData } = useContext();
  const ComponentCfgMap = config.components.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr,
    };
  }, {});
  const QueryContent = useComponents(topItems, ComponentCfgMap, assets.components);
  const SideContent = useComponents(sideItems, ComponentCfgMap, assets.components);
  const items = [
    {
      label: <Icon type="icon-layout-concentric" style={{ fontSize: '30px' }} />,
      key: 'sdk',
      children: children,
      forceRender: true,
    }, // 务必填写 key
    ...SideContent.map(item => {
      return {
        label: <Icon type={item.icon} style={{ fontSize: '30px' }} />,
        key: item.id,
        children: item.children,
      };
    }),
  ];
  const [state, setState] = React.useState({ activeKey: items?.[0]?.key });
  React.useEffect(() => {
    // @ts-ignore
    const { nodes, edges, tableResult } = graphData;
    if (!nodes.length && !edges.length && tableResult) {
      const jsonTab = items?.find(item => item.key === 'JSONMode');
      if (jsonTab) {
        setState({ activeKey: jsonTab.key });
      }
    }
  }, [graphData]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ height: `${height}px`, borderBottom: 'var(--primary-border)', padding }}>
        {QueryContent.map(item => item.children)}
      </div>
      <div style={{ width: '100%', height: `calc(100% - ${height}px` }}>
        <Tabs
          tabBarStyle={{ marginRight: ' -12px' }}
          activeKey={state.activeKey}
          onTabClick={key => setState({ activeKey: key })}
          items={items}
          tabPosition={tabPosition}
          style={{ height: '100%' }}
          className="gi-uad-layout-tabs"
        />
      </div>
    </div>
  );
};

export default UadLayout;
