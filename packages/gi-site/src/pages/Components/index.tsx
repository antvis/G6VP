// 组件市场
import React from 'react';
import { Tabs } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import { useSelector, Provider } from 'react-redux';
import GISDK, { GIContext } from '@alipay/graphinsight';
import TabContent from '../../components/TabContent';
import { getComponets, initMasket } from './services/services';
import { defaultConfig, getGraphData } from './services/defaultConfig';
import { getUid } from '../Workspace/utils';
import store from '../Analysis/redux';
import ComponentMetaPanel from './ComponentMeta';
import { getComponentMetaInfo } from './componentMetaInfo';
import './index.less';

const { TabPane } = Tabs;

const ComponentMarket = () => {
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
    initMasket();
    const components = getComponets();

    let menuList = { ...list };
    components.map(item => {
      menuList[item.category].children.push(item);
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
                <div className="content config">
                  <ComponentMetaPanel
                    onChange={handleMetaInfoChange}
                    config={getComponentMetaInfo(component.id, data)}
                  />
                </div>
              </div>
              <div>
                <MonacoEditor
                  // ref={node => {
                  //   monacoRef = node;
                  // }}
                  height="200px"
                  language="js"
                  theme="vs-dark"
                  // value={}
                  options={{}}
                  // editorDidMount={editorDidMount}
                />
              </div>
            </TabContent>
          </TabPane>
        ))}
      </Tabs>
    </div>
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
