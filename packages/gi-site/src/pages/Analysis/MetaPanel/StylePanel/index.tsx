import { FallOutlined, SmileOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import React from 'react';
import AssetsCenterHandler from '../../../../components/AssetsCenter/AssetsCenterHandler';
import EdgeStylePanel from './Edge';
import NodeStylePanel from './Node';

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

interface StylePanelProps {
  meta: any;
  data: any;
  elements: any;
  config: any;
  dispatch: any;
}

const NodeTab = (
  <span>
    <SmileOutlined />
    Node
  </span>
);
const EdgeTab = (
  <span>
    <FallOutlined />
    Edge
  </span>
);

const StylePanel: React.FunctionComponent<StylePanelProps> = props => {
  const { elements } = props;
  const { node: NodeElements, edge: EdgeElements } = elements;

  return (
    <>
      <AssetsCenterHandler title="元素" id="elements" />

      <Tabs defaultActiveKey="node" onChange={callback} centered>
        <TabPane tab={NodeTab} key="node">
          <NodeStylePanel {...props} elements={NodeElements} />
        </TabPane>
        <TabPane tab={EdgeTab} key="edge">
          <EdgeStylePanel {...props} elements={EdgeElements} />
        </TabPane>
      </Tabs>
    </>
  );
};

export default StylePanel;
