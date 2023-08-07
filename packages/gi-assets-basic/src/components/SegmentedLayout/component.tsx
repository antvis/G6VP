import { Icon, useContainer, useContext } from '@antv/gi-sdk';
import * as React from 'react';
import SegmentedTabs from './SegmentedTabs';
import './index.less';

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
  const { HAS_GRAPH } = context;
  const Containers = useContainer(context);
  const [SideContent] = Containers;

  const {
    width = 360,
    padding = 12, // 为什么这里没有值，需要关注
    components: SideContentChildren,
  } = SideContent;

  const items = SideContentChildren.map(item => {
    return {
      icon: <Icon type={item.icon} />,
      key: item.id,
      children: HAS_GRAPH && <item.component key={item.id} {...item.props} />,
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
          overflow: 'auto',
        }}
      >
        <SegmentedTabs items={items} />
      </div>
      <div style={{ width: `calc(100% - ${width + padding * 2}px)` }}>{children}</div>
    </div>
  );
};

export default SegmentedLayout;
