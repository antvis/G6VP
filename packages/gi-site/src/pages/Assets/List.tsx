import { Card, Col, Row, Tabs } from 'antd';
import * as React from 'react';
import ComponentsPanel from '../../components/AssetsCenter/Components';
const { TabPane } = Tabs;

const AssetsList = ({ data }) => {
  const callback = () => {};
  const components = React.useMemo(() => {
    return Object.values(data['components']).map(c => c.info);
  }, [data]);
  return (
    <Tabs defaultActiveKey="components" onChange={callback}>
      {Object.keys(data).map(type => {
        const item = data[type];

        return (
          <TabPane tab={type} key={type}>
            {type === 'components' && <ComponentsPanel data={components} />}
            {type !== 'components' && (
              <Row gutter={[16, 16]}>
                {Object.values(item).map((c: any, key) => {
                  return (
                    <Col span={6} key={c.info.name}>
                      <Card title={c.info.id}>{c.info.name}</Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </TabPane>
        );
      })}
    </Tabs>
  );
};
export default AssetsList;
