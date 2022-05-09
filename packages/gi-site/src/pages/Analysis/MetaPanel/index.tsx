import * as React from 'react';
import AssetsCenter from '../../../components/AssetsCenter';
import { useContext } from '../hooks/useContext';
import ComponentPanel from './ComponentPanel';
import WrapDataPanel from './DataPanel';
import './index.less';
import LayoutPanel from './LayoutPanel';
import StylesPanel from './StylesPanel';
const navbarOptions = [
  {
    id: 'data',
    name: '数据',
    component: WrapDataPanel,
  },
  {
    id: 'style',
    name: '样式',
    component: StylesPanel, // StylePanel,
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
  const { updateContext } = useContext();

  const { components, layout, node, edge } = config;

  if (Object.keys(config).length === 0) {
    return null;
  }
  const Match = navbarOptionsMap[value];

  const { component: Component } = Match;

  return (
    <div className="gi-config-pannel">
      <Component {...props} updateContext={updateContext} />
      <AssetsCenter />
    </div>
  );
};

export default MetaPanel;

// export default React.memo(MetaPanel, (prevProps, nextProps) => {
//   if (JSON.stringify(prevProps.activeAssetsKeys) !== JSON.stringify(nextProps.activeAssetsKeys)) {
//     return false;
//   }
//   console.log('MetaPanel &&&&&&', prevProps, nextProps);
//   return true;
// });
