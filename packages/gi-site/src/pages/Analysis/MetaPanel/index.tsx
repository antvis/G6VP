import * as React from 'react';
import AssetsCenter from '../../../components/AssetsCenter';
import ComponentPanel from './ComponentPanel';
import WrapDataPanel from './DataPanel';
import './index.less';
import LayoutPanel from './LayoutPanel';
import StylePanel from './StylePanel';
const navbarOptions = [
  {
    id: 'data',
    name: '数据',
    component: WrapDataPanel,
  },
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
const navbarOptionsMap = navbarOptions.reduce((acc, curr) => {
  return {
    ...acc,
    [curr.id]: curr,
  };
}, {});

const MetaPanel = props => {
  const { value, onChange, data, config, meta, services } = props;

  const { components, layout, node, edge } = config;

  if (Object.keys(config).length === 0) {
    return null;
  }
  const Match = navbarOptionsMap[value];

  const { component: Component } = Match;

  return (
    <div className="gi-config-pannel">
      <Component {...props} />
      <AssetsCenter />
    </div>
  );
};

export default React.memo(MetaPanel, (prevProps, nextProps) => {
  if (
    prevProps.value !== nextProps.value ||
    prevProps.refreshKey !== nextProps.refreshKey ||
    JSON.stringify(prevProps.config) !== JSON.stringify(nextProps.config)
  ) {
    return false;
  }
  return true;
});
