import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Col, Drawer, Modal, Row } from 'antd';
import Lockr from 'lockr';
import * as React from 'react';
import BaseNavbar from '../../components/Navbar/BaseNavbar';
import CreatePanel from './Create';
import './index.less';

interface WorkspaceProps {}

const Workspace: React.FunctionComponent<WorkspaceProps> = props => {
  const project = Lockr.get('project') || [];
  window.Lockr = Lockr;
  //@ts-ignore
  const { history } = props;

  const [lists, setLists] = React.useState(
    project.map(p => {
      return {
        ...p,
        data: Lockr.get(p.id),
      };
    }),
  );
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
  const handleDelete = id => {
    Modal.warning({
      title: '确定删除',
      content: '是否删除该项目？',
      onOk() {
        const items = Lockr.get('project').filter(d => d.id !== id);
        setLists(items);
        Lockr.rm(id);
        Lockr.set('project', items);
      },
    });
  };
  const { visible } = state;
  return (
    <>
      <div className="workspace">
        <BaseNavbar history={history} />

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
          <Row gutter={[16, 16]}>
            <Col key={'new'} span={6}>
              <Card style={{ height: '100%', width: '100%' }} hoverable onClick={handleOpen} className="new">
                <PlusOutlined style={{ fontSize: '22px', opacity: 0.85 }} />
                <span className="new-title">新增项目</span>
              </Card>
            </Col>
            {lists.map(item => {
              const { id, title, time, data } = item;
              return (
                <Col key={id} span={6}>
                  <Card
                    // style={{ height: 284, width: 321 }}
                    hoverable
                    cover={
                      <img
                        onClick={() => {
                          history.push(`/workspace/${id}`);
                        }}
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                      />
                    }
                  >
                    <div className="card-content">
                      <p>{title}</p>
                      <div>
                        <span>{time}</span>
                        <DeleteOutlined key="ellipsis" className="more" onClick={() => handleDelete(id)} />
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
      </div>
    </>
  );
};

export default Workspace;
