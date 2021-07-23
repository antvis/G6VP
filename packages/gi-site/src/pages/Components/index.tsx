// 组件市场
import { Tabs } from 'antd';
import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { Provider } from 'react-redux';
import BaseNavbar from '../../components/Navbar/BaseNavbar';
import TabContent from '../../components/TabContent';
import { getRiddleAppCode } from '../../hooks';
import store from '../Analysis/redux';
import './index.less';
import ComponentMetaPanel from './meta/ComponentMeta';
import { getComponentMetaInfo } from './meta/componentMetaInfo';
import { defaultConfig, getGraphData } from './services/defaultConfig';
import { initMarket } from './services/services';

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

  const [data, setData] = React.useState({});

  const setDefaultComponentInfo = async () => {
    // 获取初始图数据
    const result = await getGraphData();

    setData(result);
  };

  React.useEffect(() => {
    const components = initMarket();
    let menuList = { ...list };
    components.map(item => {
      menuList[item.category]?.children.push(item);
    });

    setList(menuList);

    setDefaultComponentInfo();
  }, []);

  const onChange = e => {
    setComponent(list[e].children[0] ? { id: list[e].children[0].id, enable: true } : { id: '', enable: false });
  };

  const handleMetaInfoChange = evt => {
    console.log(evt);
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
                  <div className="content view">
                    {/* <GISDK
                      key={getUid()}
                      config={{ ...defaultConfig, components: [{ ...component }] }}
                      services={{
                        getGraphData,
                      }}
                    ></GISDK> */}
                  </div>
                  <div className="content config">
                    <ComponentMetaPanel
                      onChange={handleMetaInfoChange}
                      config={getComponentMetaInfo(component.id, data)}
                    />
                  </div>
                </div>
                <div style={{ marginTop: 20 }}>
                  <MonacoEditor
                    height="200px"
                    language="js"
                    options={{
                      minimap: { enabled: false },
                      readOnly: true,
                    }}
                    value={getRiddleAppCode({ ...defaultConfig, components: [{ ...component }] })}
                  />
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
