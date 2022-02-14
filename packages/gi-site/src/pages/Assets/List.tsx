import { Card, Col, Row, Tabs } from 'antd';
import * as React from 'react';
const { TabPane } = Tabs;

const AssetsList = ({ data }) => {
  const callback = () => {};

  return (
    <Tabs defaultActiveKey="components" onChange={callback}>
      {Object.keys(data).map(type => {
        const item = data[type];
        return (
          <TabPane tab={type} key={type}>
            <Row gutter={[16, 16]}>
              {Object.values(item).map((c: any, key) => {
                return (
                  <Col span={6} key={c.info.name}>
                    <Card title={c.info.id}>{c.info.name}</Card>
                  </Col>
                );
              })}
            </Row>
          </TabPane>
        );
      })}
    </Tabs>
  );
};
export default AssetsList;
