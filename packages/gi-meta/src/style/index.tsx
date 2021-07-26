import { Tabs } from 'antd';
import React from 'react';
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

const StylePanel: React.FunctionComponent<StylePanelProps> = props => {
 
  return (
 
    <Tabs defaultActiveKey="1" onChange={callback}>
    <TabPane tab="Node" key="1">
     <NodeStylePanel {...props}/>
    </TabPane>
    <TabPane tab="Edge" key="2">
      Content of Tab Pane 2
    </TabPane>
  </Tabs>
  );
};

export default StylePanel;
