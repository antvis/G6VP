import { useContext, utils } from '@antv/gi-sdk';
import { Tabs } from 'antd';
import React from 'react';
import './index.less';
import StyleSettingPanel from './StyleSettingPanel';
import $i18n from '../../i18n';

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
        <TabPane key="nodes" tab={$i18n.get({ id: 'advance.components.StyleSetting.Component.Node', dm: '节点' })}>
          <StyleSettingPanel elementType="nodes" service={service} controlledValues={controlledValues} />
        </TabPane>
        <TabPane key="edges" tab={$i18n.get({ id: 'advance.components.StyleSetting.Component.Edge', dm: '边' })}>
          <StyleSettingPanel elementType="edges" service={service} controlledValues={controlledValues} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StyleSetting;
