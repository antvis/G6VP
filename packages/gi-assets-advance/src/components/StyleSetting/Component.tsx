import { Tabs } from 'antd';
import React from 'react';
import StyleSettingPanel from './StyleSettingPanel';
import "./index.less"

const { TabPane } = Tabs;

const StyleSetting: React.FunctionComponent = () => {
  return (
    <div className='gi-style-setting'>
      <Tabs>
      <TabPane key="nodes" tab="节点">
        <StyleSettingPanel elementType="nodes" />
      </TabPane>
      <TabPane key="edges" tab="边">
        <StyleSettingPanel elementType="edges" />
      </TabPane>
    </Tabs>
    </div>
  );
};

export default StyleSetting;
