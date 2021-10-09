import { CheckCard } from '@alipay/tech-ui';
import { Button, Col, Drawer, Row, Tabs } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { StateType } from '../../pages/Analysis/redux';
import useAssetsCenter from './useHook';

const { TabPane } = Tabs;

interface AssetsCenterProps {}

const AssetsCenter: React.FunctionComponent<AssetsCenterProps> = props => {
  const state = useSelector((state: StateType) => state);
  // const dispatch = useDispatch();
  const { handleCloseAssetsCenter } = useAssetsCenter();
  const { assetsCenter, components, config } = state;

  /** 默认选中config中的components */
  const defaultValue = config.components.map(c => c.id);
  const componentKeys = Object.keys(components).filter(c => {
    return c !== 'graphin-node' && c !== 'graphin-edge';
  });
  const displayComponents = componentKeys.map(key => {
    return components[key];
  });
  console.log(assetsCenter, 'assetsCenter', state);

  const handleCancel = () => {};
  const handleOk = () => {};
  const Footer = (
    <div>
      <Button onClick={handleCancel}>取消</Button>
      <Button onClick={handleOk} type="primary">
        确认
      </Button>
    </div>
  );
  const handleChange = () => {};

  return (
    <div>
      <Drawer
        title="资产中心"
        placement="right"
        onClose={handleCloseAssetsCenter}
        visible={assetsCenter.visible}
        footer={Footer}
        width={'80%'}
      >
        {assetsCenter.visible && (
          <Tabs defaultActiveKey={assetsCenter.hash}>
            <TabPane tab="组件" key="components">
              <CheckCard.Group multiple onChange={handleChange} defaultValue={defaultValue}>
                <Row
                  gutter={[
                    { xs: 8, sm: 16, md: 16, lg: 16 },
                    { xs: 8, sm: 16, md: 16, lg: 16 },
                  ]}
                >
                  {displayComponents.map(c => {
                    const { id, name } = c;
                    return (
                      <Col key={id}>
                        <CheckCard title={name} description="GI提供的组件" value={id} />
                      </Col>
                    );
                  })}
                </Row>
              </CheckCard.Group>
            </TabPane>
            <TabPane tab="元素" key="elements">
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="布局" key="layouts">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        )}
      </Drawer>
    </div>
  );
};

export default AssetsCenter;
