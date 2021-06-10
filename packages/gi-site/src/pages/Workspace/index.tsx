import { PlusOutlined } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import Lockr from 'lockr';
import * as React from 'react';
import { Navbar } from '../../components';
import './database';

interface WorkspaceProps {}

const Workspace: React.FunctionComponent<WorkspaceProps> = props => {
  const project = Lockr.get('project') || [];
  //@ts-ignore
  const { history } = props;

  const lists = project.map(p => {
    return {
      ...p,
      data: Lockr.get(p.id),
    };
  });
  React.useEffect(() => {}, []);

  return (
    <div>
      <Navbar history={history} />
      <Card title="我的项目">
        <Row gutter={16}>
          <Col key={'new'} span={6}>
            <Card style={{ width: '100%' }} hoverable>
              <PlusOutlined style={{ fontSize: '50px' }} />
              创建项目
            </Card>
          </Col>
          {lists.map(item => {
            const { id, title, data } = item;
            return (
              <Col key={id} span={6}>
                <Card
                  title={title}
                  style={{ width: '100%' }}
                  hoverable
                  onClick={() => {
                    history.push(`/workspace/${id}`);
                  }}
                >
                  test..
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>
    </div>
  );
};

export default Workspace;
