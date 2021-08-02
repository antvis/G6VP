import * as React from 'react';
import ComponentPanel from './ComponentPanel';
import './index.less';
import LayoutPanel from './LayoutPanel';
import StylePanel from './StylePanel';

const navbarOptions = [
  {
    id: 'style',
    name: '样式',
    component: StylePanel,
  },

  {
    id: 'layout',
    name: '布局',
    component: LayoutPanel,
  },
  {
    id: 'components',
    name: '组件',
    component: ComponentPanel,
  },
];

const MetaPanel = props => {
  const { value, onChange, data, config, meta, services } = props;

  const { components, layout, node, edge } = config;

  if (Object.keys(config).length === 0) {
    return null;
  }
  const Match = navbarOptions.find(c => c.id === value);

  const { component: Component } = Match;

  return (
    <div className="gi-config-pannel">
      <Component {...props} />
    </div>
  );
};

export default React.memo(MetaPanel, (prevProps, nextProps) => {
  if (prevProps.value !== nextProps.value || prevProps.refreshKey !== nextProps.refreshKey) {
    return false;
  }
  return true;
});
