import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Col, Drawer, Modal, Row } from 'antd';
import BaseNavbar from '../../components/Navbar/BaseNavbar';
import * as React from 'react';
import { useHistory, useRequest } from '@alipay/bigfish'
import CreatePanel from './Create';
import { getProjectList, removeProjectById } from '../../services';
import './database';
import './index.less';

interface WorkspaceProps {}

const Workspace: React.FunctionComponent<WorkspaceProps> = props => {
  const history = useHistory();
  const { data: defaultProjects = [], getProjects } = useRequest(getProjectList);

  const [lists, setLists] = React.useState(defaultProjects);
  React.useEffect(() => {
    getProjects().then(data => {
      const list =  data.map(d => d.isProject);
      setLists(list);
    })
  }, []);

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
        const items = lists.filter(d => d.id !== id);
        setLists(items);
        removeProjectById(id);
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
          <CreatePanel />
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
              const { id, title, time } = item;
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
