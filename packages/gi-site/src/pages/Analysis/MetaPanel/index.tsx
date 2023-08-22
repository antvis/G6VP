import * as React from 'react';
import { useImmer } from 'use-immer';
import { useContext } from '../hooks/useContext';
import ComponentPanel from './ComponentPanel';
import ContainerPanel from './ContainerPanel';
import WrapDataPanel from './DataPanel';
import LayoutPanel from './LayoutPanel';
import StylesPanel from './StylesPanel';
import $i18n from '../../../i18n';
import './index.less';

const navbarOptions = [
  {
    id: 'data',
    name: $i18n.get({ id: 'gi-site.Analysis.MetaPanel.Data', dm: '数据' }),
    component: WrapDataPanel,
  },
  {
    id: 'style',
    name: $i18n.get({ id: 'gi-site.Analysis.MetaPanel.Style', dm: '样式' }),
    component: StylesPanel, // StylePanel,
  },

  {
    id: 'layout',
    name: $i18n.get({ id: 'gi-site.Analysis.MetaPanel.Layout', dm: '布局' }),
    component: LayoutPanel,
  },
  {
    id: 'components',
    name: $i18n.get({ id: 'gi-site.Analysis.MetaPanel.Component', dm: '组件' }),
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
  const { value, config, setPanelWidth, collapse } = props;
  const { updateContext, context } = useContext();

  const [state, setState] = useImmer({
    panelHeight: '100%',
  });

  if (Object.keys(config).length === 0) {
    return null;
  }

  React.useEffect(() => {
    setState(draft => {
      draft.panelHeight = '100%';
    });
    if (value !== 'components') {
      setPanelWidth({
        width: '345px',
        minWidth: 'unset',
      });
    }
  }, [value]);

  const { component: Component } = navbarOptionsMap[value] || {};

  return (
    <div className="gi-config-panel" style={{ height: state.panelHeight || '100%' }}>
      {Component && (
        <Component
          {...props}
          updateContext={updateContext}
          context={context}
          setPanelHeight={height =>
            setState(draft => {
              draft.panelHeight = height;
            })
          }
          setPanelWidth={setPanelWidth}
          collapse={collapse}
        />
      )}
    </div>
  );
};

export default MetaPanel;
