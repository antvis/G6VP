// 组件市场
import React from 'react';
import { Tabs } from 'antd';
import TabContent from '../../components/TabContent';
import { getComponets, initMasket } from './services/services';
import './index.less';

const { TabPane } = Tabs;

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

const ComponentMarket = () => {
  const [list, setList] = React.useState(defaultList);

  React.useEffect(() => {
    initMasket();
    const components = getComponets();

    let menuList = { ...list };
    components.map(item => {
      menuList[item.category].children.push(item);
    });

    setList(menuList);
  }, []);

  return (
    <div className="componet-market">
      <Tabs defaultActiveKey="component">
        {Object.keys(list).map(key => (
          <TabPane tab={list[key].title} key={key}>
            <TabContent list={list[key]} />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default ComponentMarket;
