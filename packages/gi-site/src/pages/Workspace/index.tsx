import { useHistory, useRequest } from '@alipay/bigfish';
import { Card, Col, Drawer, Modal, Row, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import * as React from 'react';
import { QuestionCircleOutlined, BellOutlined } from '@ant-design/icons';
import BaseNavbar from '../../components/Navbar/BaseNavbar';
import { getProjectList, removeProjectById } from '../../services';
import CreatePanel from './Create';
import ProjectList from './projectList';
import './index.less';

interface WorkspaceProps {}
const { TabPane } = Tabs;
const Workspace: React.FunctionComponent<WorkspaceProps> = props => {
  const { data: defaultProjects = [], run: getProjects } = useRequest(getProjectList);

  const [lists, setLists] = React.useState(defaultProjects);
  React.useEffect(() => {
    getProjects().then(list => {
      setLists(list);
    });
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
  const leftContent = (
    <>
      <span style={{ marginRight: '36px', cursor: 'pointer' }}>
        <Link to="/workspace">项目列表</Link>
      </span>
      <span style={{ marginRight: '36px', cursor: 'pointer' }}>
        <Link to="/market">资产市场</Link>
      </span>
    </>
  );
  const rightContent = (
    <>
      <QuestionCircleOutlined />
      <BellOutlined />
    </>
  );
  const { visible } = state;

  return (
    <>
      <div className="workspace">
        <BaseNavbar leftContent={leftContent} rightContent={rightContent} />
        <Tabs style={{ margin: 15 }}>
          <TabPane tab={'我的项目'} key={'project'}>
            <ProjectList data={lists} handleOpen={handleOpen} handleDelete={handleDelete} type="project" />
          </TabPane>
          <TabPane tab={'我的收藏'} key={'collect'}>
            <ProjectList data={lists} type="collect" />
          </TabPane>
          <TabPane tab={'行业案例'} key={'case'}>
            <ProjectList data={lists} type="case" />
          </TabPane>
        </Tabs>
      </div>
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
    </>
  );
};

export default Workspace;
