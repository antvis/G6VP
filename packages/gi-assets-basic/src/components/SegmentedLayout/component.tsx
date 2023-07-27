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

  /**
   * hack start
   *
   * 不应该修改 registerMeta 原有的containers 数据结构
   * 1. 先把追加的 GI_FreeContainer 移除
   * 2. 把 GI_CONTAINER 中的 数组对象 改为字符串
   *
   * TODO：
   * 需要在gi-site层修改这个containers的值
   *
   */
  const containers = props.containers.slice(0, -1).map(item => {
    return {
      ...item,
      GI_CONTAINER: item.GI_CONTAINER.map(item => item.value),
    };
  });
  /** hack end */

  const Containers = useContainer(context, containers);

  const [SideContent] = Containers;

  const {
    width = 360,
    padding = 12, // 为什么这里没有值，需要关注
    children: SideContentChildren,
  } = SideContent;

  const items = SideContentChildren.map((item: any) => {
    return {
      icon: <Icon type={item.icon} />,
      key: item.id,
      children: HAS_GRAPH && item.component,
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
