import { Icon, useContext } from '@antv/gi-sdk';
import { Tabs } from 'antd';
import React, { memo } from 'react';
import './index.less';
import useComponents from './useComponents';

export interface UadLayoutProps {
  containers: {
    id: string;
    name: string;
    GI_CONTAINER: string[] | { label: string; value: string }[];
    tabPosition?: 'right' | 'left' | 'top' | 'bottom';
    padding?: string;
    height?: number;
  }[];
  children: React.ReactNode[];
}

const UadLayout: React.FunctionComponent<UadLayoutProps> = props => {
  const { children, containers = [] } = props;
  const { assets, context } = useContext();
  const { HAS_GRAPH, data: graphData, components: componentsCfg } = context;
  const { GI_CONTAINER: topItems = [], height = 251 } =
    containers.find(container => container.id === 'GI_CONTAINER_TOP') || {};
  const {
    GI_CONTAINER: sideItems = [],
    tabPosition = 'right',
    padding = '0px 0px',
  } = containers.find(container => container.id === 'GI_CONTAINER_SIDE') || {};

  const ComponentCfgMap = componentsCfg.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr,
    };
  }, {});

  const QueryContent = useComponents(topItems, ComponentCfgMap, assets.components) as any[];
  const SideContent = useComponents(sideItems, ComponentCfgMap, assets.components);
  const items = [
    {
      label: <Icon type="icon-layout-concentric" style={{ fontSize: '30px' }} />,
      key: 'sdk',
      children: children,
      forceRender: true,
    }, // 务必填写 key
    ...SideContent.map(item => {
      return item
        ? {
            label: <Icon type={item.icon} style={{ fontSize: '30px' }} />,
            key: item.id,
            children: HAS_GRAPH && item.children, //保证有 graph 实例
          }
        : false;
    }),
  ].filter(Boolean) as any[];
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
      <div className="gi-uad-layout-canvas-wrapper" style={{ height: `calc(100% - ${height + 16}px` }}>
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

export default memo(UadLayout);
