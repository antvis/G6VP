// 组件市场
import React from 'react';
import { Tabs } from 'antd';
import GISDK, { GIContext } from '@alipay/graphinsight';
import TabContent from '../../components/TabContent';
import { getComponets, initMasket } from './services/services';
import { defaultConfig, getGraphData } from './services/defaultConfig';
import { getUid } from '../Workspace/utils';
import './index.less';

const { TabPane } = Tabs;

const ComponentMarket = () => {
  const defaultList = {
    analysis: {
      title: '分析组件',
      children: [],
    },
    events: {
      title: '交互组件',
      children: [],
    },
    materials: {
      title: '物料',
      children: [],
    },
  };
  const [list, setList] = React.useState(defaultList);
  const [component, setComponent] = React.useState({ id: 'Legend', enable: true });

  React.useEffect(() => {
    initMasket();
    const components = getComponets();

    let menuList = { ...list };
    components.map(item => {
      menuList[item.category].children.push(item);
    });

    setList(menuList);
  }, []);

  const onChange = e => {
    setComponent(list[e].children[0] ? { id: list[e].children[0].id, enable: true } : { id: '', enable: false });
  };

  return (
    <div className="componet-market">
      <Tabs defaultActiveKey="component" onChange={onChange}>
        {Object.keys(list).map(key => (
          <TabPane tab={list[key].title} key={key}>
            <TabContent list={list[key]} onChange={id => setComponent({ id, enable: true })}>
              <div className="gi-sdk-wrapper">
                <div className="content view">
                  <GISDK
                    key={getUid()}
                    config={{ ...defaultConfig, components: [{ ...component }] }}
                    services={{
                      getGraphData,
                    }}
                  ></GISDK>
                </div>
                <div className="content config">配置面板</div>
              </div>
            </TabContent>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default ComponentMarket;
