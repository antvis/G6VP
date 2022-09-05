import { Tabs } from 'antd';
import { utils, useContext } from '@alipay/graphinsight';
import React from 'react';
import StyleSettingPanel from './StyleSettingPanel';
import './index.less';
import { string } from 'prop-types';

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
