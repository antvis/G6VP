import { useContext, utils } from '@alipay/graphinsight';
import { Tabs } from 'antd';
import React from 'react';
import './index.less';
import StyleSettingPanel from './StyleSettingPanel';

const { TabPane } = Tabs;

export interface StyleSettingProps {
  serviceId: string;
}

const StyleSetting: React.FC<StyleSettingProps> = props => {
  const { serviceId } = props;
  const { services } = useContext();
  const service = utils.getService(services, serviceId);

  return (
    <div className="gi-style-setting">
      <Tabs>
        <TabPane key="nodes" tab="节点">
          <StyleSettingPanel elementType="nodes" service={service} />
        </TabPane>
        <TabPane key="edges" tab="边">
          <StyleSettingPanel elementType="edges" service={service} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StyleSetting;
