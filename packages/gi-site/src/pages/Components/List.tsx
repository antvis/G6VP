// 组件市场
import React from 'react';
import { Tabs } from 'antd';
import { Provider } from 'react-redux';
import TabContent from '../../components/TabContent';
import { initMarket } from './services/services';
import store from '../Analysis/redux';
import BaseNavbar from '../../components/Navbar/BaseNavbar';
import './index.less';

const { TabPane } = Tabs;

const ComponentMarket = props => {
  const { history } = props;
  const defaultList = {
    analysis: {
      title: '分析组件',
      children: [],
    },
    behavior: {
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
    const components = initMarket();
    let menuList = { ...list };
    components.map(item => {
      menuList[item.category]?.children.push(item);
    });

    setList(menuList);

  }, []);

  const onChange = e => {
    setComponent(list[e].children[0] ? { id: list[e].children[0].id, enable: true } : { id: '', enable: false });
  };
  
  return (
    <>
      <BaseNavbar history={history}>
        <h4>物料中心</h4>
      </BaseNavbar>
      <div className="componet-market">
        <Tabs defaultActiveKey="component" onChange={onChange}>
          {Object.keys(list).map(key => (
            <TabPane tab={list[key].title} key={key}>
              <TabContent list={list[key]} onChange={id => setComponent({ id, enable: true })}>
                <div className="gi-sdk-wrapper">
                
                </div>
                <div style={{ marginTop: 20 }}>
                
                </div>
              </TabContent>
            </TabPane>
          ))}
        </Tabs>
      </div>
    </>
  );
};

const WrapAnalysis = props => {
  return (
    <Provider store={store}>
      <ComponentMarket {...props} />
    </Provider>
  );
};

export default WrapAnalysis;
