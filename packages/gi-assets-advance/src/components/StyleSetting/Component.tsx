import { useContext, utils } from '@antv/gi-sdk';
import { Tabs } from 'antd';
import React from 'react';
import './index.less';
import StyleSettingPanel from './StyleSettingPanel';

const { TabPane } = Tabs;

export interface StyleSettingProps {
  serviceId: string;
  controlledValues?: {
    elementType: string;
    styleGroups: any;
  };
}

const StyleSetting: React.FC<StyleSettingProps> = props => {
  const { serviceId, controlledValues } = props;
  const { services } = useContext();
  const service = utils.getService(services, serviceId);

  return (
    <div className="gi-style-setting">
      <Tabs>
        <TabPane key="nodes" tab="节点">
          <StyleSettingPanel elementType="nodes" service={service} controlledValues={controlledValues} />
        </TabPane>
        <TabPane key="edges" tab="边">
          <StyleSettingPanel elementType="edges" service={service} controlledValues={controlledValues} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StyleSetting;
