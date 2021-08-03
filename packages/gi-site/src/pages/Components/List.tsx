// 组件市场
import { AppstoreOutlined, BranchesOutlined } from '@ant-design/icons';
import { Card, Col, Row, Tabs } from 'antd';
import React from 'react';
import { Provider } from 'react-redux';
import { useImmer } from 'use-immer';
import BaseNavbar from '../../components/Navbar/BaseNavbar';
import { queryAssets } from '../../services/assets.market';
import { getComponentsByAssets, getElementsByAssets } from '../Analysis/getAssets';
import store from '../Analysis/redux';
import './index.less';

const { TabPane } = Tabs;

const ComponentMarket = props => {
  const { history } = props;

  const [state, setState] = useImmer({
    components: [],
    elements: { node: {}, edge: {} },
  });

  React.useEffect(() => {
    queryAssets('userId').then(res => {
      const data = {};
      const { components: ComponentAssets, elements: ElementAssets, services: ServicesAssets } = res;
      const components = getComponentsByAssets(ComponentAssets, data);
      const elements = getElementsByAssets(ElementAssets, data);

      setState(draft => {
        draft.components = components;
        draft.elements = elements;
      });
    });
  }, []);
  const { components, elements } = state;

  const NodeElements = Object.values(elements.node);
  const EdgeElements = Object.values(elements.edge);
  const handleClickComponent = componentId => {
    history.push(`/market/${componentId}`);
  };
  return (
    <>
      <BaseNavbar history={history}>
        <h4>资产中心</h4>
      </BaseNavbar>
      <div>
        <Tabs defaultActiveKey="component" centered>
          <TabPane
            key="components"
            tab={
              <span>
                <AppstoreOutlined />
                组件
              </span>
            }
          >
            <Row
              gutter={[
                { xs: 8, sm: 16, md: 16, lg: 16 },
                { xs: 8, sm: 16, md: 16, lg: 16 },
              ]}
            >
              {components.map(c => {
                const { id, name } = c;
                return (
                  <Col key={id} style={{ width: '300px' }}>
                    <Card
                      hoverable
                      title={name}
                      onClick={() => {
                        handleClickComponent(id);
                      }}
                    >
                      {id} <br />
                      {name}
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </TabPane>
          <TabPane
            tab={
              <span>
                <BranchesOutlined />
                元素
              </span>
            }
            key="elements"
          >
            <Row>
              <Col span={12}>
                <Card title={'节点元素 Node'}>
                  <Row
                    gutter={[
                      { xs: 8, sm: 16, md: 16, lg: 16 },
                      { xs: 8, sm: 16, md: 16, lg: 16 },
                    ]}
                  >
                    {NodeElements.map(c => {
                      //@ts-ignore
                      const { id, name } = c;
                      return (
                        <Col key={id} style={{ width: '300px' }}>
                          <Card title={name}>{name}</Card>
                        </Col>
                      );
                    })}
                  </Row>
                </Card>
              </Col>
              <Col span={12}>
                <Card title={'边元素 Edge'}>
                  <Row
                    gutter={[
                      { xs: 8, sm: 16, md: 16, lg: 16 },
                      { xs: 8, sm: 16, md: 16, lg: 16 },
                    ]}
                  >
                    {EdgeElements.map(c => {
                      //@ts-ignore
                      const { id, name } = c;
                      return (
                        <Col key={id} style={{ width: '300px' }}>
                          <Card title={name}>{name}</Card>
                        </Col>
                      );
                    })}
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

const WrapAssetsMarket = props => {
  return (
    <Provider store={store}>
      <ComponentMarket {...props} />
    </Provider>
  );
};

export default WrapAssetsMarket;
