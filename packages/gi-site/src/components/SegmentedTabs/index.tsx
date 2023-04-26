import { Card, Segmented } from 'antd';
import * as React from 'react';
import { ReactNode } from 'react';
import { getSearchParams } from '../utils';
import './index.less';
interface SegmentedTabsProps {
  items: { key: string; children: ReactNode; label?: string; icon?: ReactNode }[];
  queryKey?: string;
  style?: React.CSSProperties;
  extra?: ReactNode;
  defaultActive?: string;
}

const SegmentedTabs: React.FunctionComponent<SegmentedTabsProps> = props => {
  const { items, queryKey = 'tab', style = {}, extra = <></>, defaultActive } = props;

  const [state, setState] = React.useState<{ active: string }>(() => {
    const { searchParams, path } = getSearchParams(window.location);
    const active = searchParams.get(queryKey) || defaultActive || items[0].key;
    return {
      active,
    };
  });

  const { active } = state;
  const options = items.map(item => {
    return {
      value: item.key,
      label: item.label,
      icon: item.icon,
    };
  });

  const onChange = value => {
    const { searchParams, path } = getSearchParams(window.location);
    searchParams.set(queryKey, value);
    window.location.hash = `${path}?${searchParams.toString()}`;
    setState(preState => {
      return {
        ...preState,
        active: value,
      };
    });
  };

  return (
    <Card
      style={{ borderRadius: '8px', height: '100%', background: 'var(--background-color-transparent)' }}
      bodyStyle={{
        width: 'calc(100vw - 300px)',
        height: 'calc(100vh - 180px)',
        overflow: 'auto',
        padding: '12px 12px',
        ...style,
      }}
      title={<Segmented options={options} value={active} onChange={onChange} />}
      extra={extra}
    >
      <div className="gi-segmented-tabs">
        {items.map(item => {
          const { key, children } = item;
          const isActive = key === active;
          return (
            <div className={isActive ? 'appear' : 'hidden'} key={key}>
              {children}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SegmentedTabs;
