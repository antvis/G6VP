import { Icon, useContext } from '@antv/gi-sdk';
import * as React from 'react';
import './index.less';
import SegmentedTabs from './SegmentedTabs';
import useComponents from './useComponents';

export interface UadLayoutProps {
  topItems: any[];
  sideItems: any[];
  tabPosition: 'left' | 'right' | 'top' | 'bottom';
  height: number;
  padding: string;
  containers: any[];
}

const SegmentedLayout: React.FunctionComponent<UadLayoutProps> = props => {
  const { children } = props;
  const context = useContext();
  const { graph } = context;
  // 对于布局组件，因为其渲染顺序高于画布组件，因此不得不先判断一次是否存在 graph 实例
  const HAS_GRAPH = graph && !graph.destroyed;

  const { containers } = props;
  const { config, assets } = context;

  const ComponentCfgMap = config.components.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr,
    };
  }, {});

  const { GI_CONTAINER: sideItems = [], width = 360, padding = 12 } = containers[0] || {};

  const SideContent = useComponents(sideItems, ComponentCfgMap, assets.components);
  const items = SideContent.map((item: any) => {
    return {
      icon: <Icon type={item.icon} />,
      key: item.id,
      children: HAS_GRAPH && item.children,
    };
  });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <div
        style={{
          width: `${width}px`,
          marginRight: `${padding}px`,
          background: 'var(--background-color-transparent)',
          borderRadius: '8px',
        }}
      >
        <SegmentedTabs items={items} />
      </div>
      <div style={{ width: `calc(100% - ${width + padding * 2}px)` }}>{children}</div>
    </div>
  );
};

export default SegmentedLayout;
