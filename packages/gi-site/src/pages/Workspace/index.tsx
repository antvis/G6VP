import { PlusOutlined } from '@ant-design/icons';
import { Card, Col, Drawer, Row } from 'antd';
import Lockr from 'lockr';
import * as React from 'react';
import CreatePanel from './Create';
import './database';
import './index.less';

interface WorkspaceProps {}

const Workspace: React.FunctionComponent<WorkspaceProps> = props => {
  const project = Lockr.get('project') || [];
  window.Lockr = Lockr;
  //@ts-ignore
  const { history } = props;
  console.log(project);

  const lists = project.map(p => {
    return {
      ...p,
      data: Lockr.get(p.id),
    };
  });
  React.useEffect(() => {}, []);

  const [state, setState] = React.useState({
    visible: false,
  });
  const handleClose = () => {
    setState(preState => {
      return { ...preState, visible: false };
    });
  };
  const handleOpen = () => {
    setState(preState => {
      return { ...preState, visible: true };
    });
  };
  const { visible } = state;
  return (
    <div>
      {/* <Navbar history={history} /> */}

      <Drawer
        title="创建项目"
        placement={'right'}
        closable={false}
        onClose={handleClose}
        visible={visible}
        width={'80%'}
      >
        <CreatePanel history={history} />
      </Drawer>
      <Card title="我的项目">
        <Row gutter={16}>
          <Col key={'new'} span={6}>
            <Card style={{ width: '100%' }} hoverable onClick={handleOpen}>
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
