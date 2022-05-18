import { Tabs } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import DataModeCard from '../../components/DataModeCard';
import BaseNavbar from '../../components/Navbar/BaseNavbar';
import setDefaultDemo from '../X-Studio';
import CreatePanel from './Create';
import './index.less';
import ProjectList from './projectList';

setDefaultDemo();

interface WorkspaceProps {}
const { TabPane } = Tabs;

const LIST_OPTIONS: { id: 'case' | 'project' | 'save'; name: string }[] = [
  {
    id: 'case',
    name: '行业案例',
  },
  {
    id: 'project',
    name: '我的项目',
  },
  {
    id: 'save',
    name: '我的保存',
  },
];
const Workspace: React.FunctionComponent<WorkspaceProps> = props => {
  const [state, updateState] = useImmer({
    visible: false,
  });

  const handleClose = () => {
    updateState(draft => {
      draft.visible = false;
    });
  };

  const handleOpen = () => {
    updateState(draft => {
      draft.visible = true;
    });
  };

  const { visible } = state;

  return (
    <>
      <div className="workspace">
        <BaseNavbar rightContentExtra={<DataModeCard />}></BaseNavbar>
        <div
          style={{
            overflow: 'scroll',
            padding: '24px 48px',
            height: 'calc(100vh - 64px)',
            background: '#fafafa',
          }}
        >
          <Tabs
            tabPosition="left"
            style={{
              background: '#fff',
              height: '100%',
              padding: '24px 0px',
            }}
          >
            {LIST_OPTIONS.map(c => {
              return (
                <TabPane tab={c.name} key={c.id}>
                  <ProjectList type={c.id} onCreate={handleOpen} />
                </TabPane>
              );
            })}
          </Tabs>
        </div>
      </div>
      <CreatePanel visible={visible} handleClose={handleClose} />
    </>
  );
};

export default Workspace;
