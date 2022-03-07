import { CheckCard } from '@alipay/tech-ui';
import { RobotOutlined } from '@ant-design/icons';
import { Avatar, Col, Collapse, Row } from 'antd';
import * as React from 'react';

const { Panel } = Collapse;

interface ComponentsPanelProps {
  data: any[];
  handleChange: (a: any, b: any) => void;
  defaultValue: any[];
}

const cardContent = item => {
  const { version = '最新', ownerNickname = '官方', gmtModified } = item;
  return (
    <div className="asset-detail">
      <ul>
        <li>作者：{ownerNickname}</li>
        <li>版本：{version}</li>
        {/* <li>更新：{moment(gmtModified, 'YYYY-MM-DD HH:mm:ss').fromNow()}</li> */}
      </ul>
      {/* <div className="asset-detail-buttom"> */}
      {/* <div className="asset-favorite">Text</div> */}
      {/* </div> */}
    </div>
  );
};

const ComponentsPanel: React.FunctionComponent<ComponentsPanelProps> = props => {
  const { data, handleChange, defaultValue } = props;
  console.log('data', data, handleChange, defaultValue);
  const res = React.useMemo(() => {
    return data.reduce((acc, curr) => {
      const { category } = curr;
      const children = acc[category];
      if (children) {
        acc[category] = [...children, curr];
      } else {
        acc[category] = [curr];
      }

      return acc;
    }, {});
  }, [data]);

  return (
    <div>
      <CheckCard.Group
        multiple
        onChange={val => {
          handleChange('components', val);
        }}
        defaultValue={defaultValue}
      >
        <Collapse defaultActiveKey={['1']} ghost>
          {Object.keys(res).map(category => {
            return (
              <Panel header={category} key={category}>
                <Row
                  gutter={[
                    { xs: 8, sm: 12, md: 12, lg: 12 },
                    { xs: 8, sm: 12, md: 12, lg: 12 },
                  ]}
                  style={{ padding: '8px 0px' }}
                >
                  {res[category].map(item => {
                    const { id: AssetId, name: AssetName } = item;
                    return (
                      <Col key={AssetId}>
                        <CheckCard
                          bordered={false}
                          className="assetsCardStyle"
                          title={AssetName}
                          avatar={
                            <Avatar
                              style={{ backgroundColor: '#EAEEFC', color: '#3056E3' }}
                              icon={<RobotOutlined />}
                              size={24}
                            />
                          }
                          description={cardContent(item)}
                          value={AssetId}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Panel>
            );
          })}
        </Collapse>
      </CheckCard.Group>
    </div>
  );
};

export default ComponentsPanel;
