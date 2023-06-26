import { Tabs } from 'antd';
import React from 'react';
import AssetsCenterHandler from '../../../../components/AssetsCenter/AssetsCenterHandler';
import StyleSettig from './StyleSetting';
import $i18n from '../../../../i18n';
import './index.less';

const { TabPane } = Tabs;

interface StylePanelProps {
  meta: any;
  data: any;
  elements: any;
  config: any;
}

const NodeTab = <div className="tab-title">{$i18n.get({ id: 'gi-site.MetaPanel.StylesPanel.Node', dm: '节点' })}</div>;
const EdgeTab = <div className="tab-title">{$i18n.get({ id: 'gi-site.MetaPanel.StylesPanel.Edge', dm: '边' })}</div>;
const StylePanel: React.FunctionComponent<StylePanelProps> = props => {
  const { elements } = props;
  const { nodes: NodeElements, edges: EdgeElements } = elements;
  const defaultActiveKey = 'nodes';

  return (
    <>
      <AssetsCenterHandler
        title={$i18n.get({ id: 'gi-site.MetaPanel.StylesPanel.Element', dm: '元素' })}
        id="elements"
      />
      <Tabs defaultActiveKey={defaultActiveKey} centered id="gi-switch-elements-tab">
        <TabPane tab={NodeTab} key="nodes">
          <StyleSettig elementType="nodes" elements={NodeElements} />
        </TabPane>
        <TabPane tab={EdgeTab} key="edges">
          <StyleSettig elementType="edges" elements={EdgeElements} />
        </TabPane>
      </Tabs>
    </>
  );
};

export default StylePanel;
