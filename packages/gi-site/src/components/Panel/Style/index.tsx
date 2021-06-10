import { Tabs } from 'antd';
import * as React from 'react';
import './index.less';

const { TabPane } = Tabs;
const callback = () => {};

export interface StylePanelProps {}
const StylePanel: React.FunctionComponent<StylePanelProps> = props => {
  return (
    <div>
      <Tabs defaultActiveKey="node" onChange={callback}>
        <TabPane tab="节点样式" key="node">
          Node
        </TabPane>
        <TabPane tab="边的样式" key="edge">
          Edge
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StylePanel;
