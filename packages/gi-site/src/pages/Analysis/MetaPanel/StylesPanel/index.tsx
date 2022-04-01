import { Tabs } from 'antd';
import React from 'react';
import AssetsCenterHandler from '../../../../components/AssetsCenter/AssetsCenterHandler';
import './index.less';
import NodeStyleSetting from './Node';

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

interface StylePanelProps {
  meta: any;
  data: any;
  elements: any;
  config: any;
}

const NodeTab = <div className="tab-title">节点</div>;
const EdgeTab = <div className="tab-title">边</div>;

const StylePanel: React.FunctionComponent<StylePanelProps> = props => {
  const { elements } = props;
  const { nodes: NodeElements, edges: EdgeElements } = elements;
  console.log('NodeElements', NodeElements);
  return (
    <>
      <AssetsCenterHandler title="元素" id="elements" />

      <Tabs defaultActiveKey="node" onChange={callback} centered id="gi-switch-elements-tab">
        <TabPane tab={NodeTab} key="node">
          {/* <NodeStylePanel {...props} elements={NodeElements} /> */}
          <NodeStyleSetting elementType="node" elements={NodeElements} />
        </TabPane>
        <TabPane tab={EdgeTab} key="edge">
          {/* <EdgeStylePanel {...props} elements={EdgeElements} /> */}
        </TabPane>
      </Tabs>
    </>
  );
};

export default React.memo(StylePanel, () => true);
