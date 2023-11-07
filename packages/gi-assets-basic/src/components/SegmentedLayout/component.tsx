import { Icon, useContainer, useContext } from '@antv/gi-sdk';
import React, { memo, useMemo } from 'react';
import SegmentedTabs from './SegmentedTabs';
import './index.less';

export interface UadLayoutProps {
  topItems: any[];
  sideItems: any[];
  tabPosition: 'left' | 'right' | 'top' | 'bottom';
  height: number;
  padding: string;
  containers: any[];
  children: any;
}

const SegmentedLayout: React.FunctionComponent<UadLayoutProps> = props => {
  const { children } = props;
  const { context, assets } = useContext();
  const { HAS_GRAPH, components, pageLayout } = context;

  const Containers = useContainer(assets, components, pageLayout);
  const [SideContent] = Containers;
  const { width = 360, padding = 12 } = SideContent;
  const items = useMemo(() => {
    return SideContent.components.map(item => {
      return {
        icon: <Icon type={item.icon} />,
        key: item.id,
        children: HAS_GRAPH && <item.component key={item.id} {...item.props} />,
      };
    });
  }, [HAS_GRAPH, SideContent.components]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <div
        style={{
          width: `${width}px`,
          marginRight: `${padding}px`,
          background: 'var(--background-color-transparent)',
          borderRadius: '8px',
          overflow: 'auto',
        }}
      >
        <SegmentedTabs items={items} />
      </div>
      <div
        style={{
          width: `calc(100% - ${width + padding * 2}px)`,
          position: 'relative',
          transform: 'scale(1)',
          height: 'calc(100% - 12px)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default memo(SegmentedLayout);
