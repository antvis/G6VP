import { useRequest } from '@alipay/bigfish';
import { Modal, Tabs } from 'antd';
import * as React from 'react';
import BaseNavbar from '../../components/Navbar/BaseNavbar';
import { getFavoriteList, getProjectList, removeProjectById } from '../../services';
import CreatePanel from './Create';
import './index.less';
import ProjectList from './projectList';

interface WorkspaceProps {}
const { TabPane } = Tabs;
const Workspace: React.FunctionComponent<WorkspaceProps> = props => {
  const { data: defaultProjects = [], run: getProjects } = useRequest(getProjectList);

  const [lists, setLists] = React.useState(defaultProjects);
  React.useEffect(() => {
    getProjects().then(list => {
      setLists(list);
    });

    getFavoriteList().then(list => {
      // setLists(list);
      console.log(list);
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
    Modal.confirm({
      title: '确定删除',
      content: '是否删除该项目？',
      cancelText: '取消',
      okText: '确定',
      onOk() {
        const items = lists.filter(d => d.id !== id);
        setLists(items);
        removeProjectById(id);
      },
      onCancel() {},
    });
  };

  const { visible } = state;

  return (
    <>
      <div className="workspace">
        <BaseNavbar />
        <div style={{ overflow: 'scroll', height: 'calc(100vh - 64px)' }}>
          <Tabs>
            <TabPane tab={'我的项目'} key={'project'}>
              <ProjectList data={lists} handleOpen={handleOpen} handleDelete={handleDelete} type="project" />
            </TabPane>
            <TabPane tab={'我的收藏'} key={'collect'}>
              <ProjectList data={lists} type="collect" />
            </TabPane>
            <TabPane tab={'行业案例'} key={'case'}>
              <ProjectList data={[]} type="case" />
            </TabPane>
          </Tabs>
        </div>
      </div>
      <CreatePanel visible={visible} handleClose={handleClose} />
    </>
  );
};

export default Workspace;
