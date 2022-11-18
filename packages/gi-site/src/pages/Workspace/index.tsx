import { Tabs } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';

import DataModeCard from '../../components/DataModeCard';
import Notification from '../../components/Notification';
import QRcode from '../../components/QRcode';
import { getSearchParams } from '../../components/utils';
import { loader } from '../../loader';
import setDefaultDemo from '../X-Studio';
import Case from './Case';
import CreatePanel from './Create';
import './index.less';
import ProjectList from './projectList';
import SaveList from './SaveList';

setDefaultDemo();

interface WorkspaceProps {}
const { TabPane } = Tabs;

export type NavbarId = 'case' | 'project' | 'save' | 'deployed';
export interface DeployItem {
  id: NavbarId;
  name: string;
  component: React.ReactNode;
}

const LIST_OPTIONS: { id: NavbarId; name: string }[] = [
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
  const { searchParams } = getSearchParams(location);
  const type = searchParams.get('type') || 'project';
  const GI_UPLOADED_DATA = localStorage.getItem('GI_UPLOADED_DATA') === 'true';
  const defaultActiveKey = GI_UPLOADED_DATA ? type : 'case';

  const [state, updateState] = useImmer({
    visible: false,
    activeKey: defaultActiveKey,
    deploys: [] as DeployItem[],
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

  const { visible, activeKey, deploys } = state;
  const handleChange = val => {
    try {
      const { searchParams } = getSearchParams(location);
      const type = searchParams.get('type') || 'case';
      const newHref = window.location.href.replace(type, val);
      window.location.href = newHref;
      updateState(draft => {
        draft.activeKey = val;
      });
    } catch (error) {
      console.warn(error);
    }
  };

  const rightContentExtra = (
    <>
      {/* {IS_LOCAL_ENV && <AlibabaLogin />} */}
      <Notification />
      <QRcode />
      <DataModeCard />
    </>
  );

  React.useEffect(() => {
    const GI_ASSETS_PACKAGES = JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}');
    const { GI_ASSETS_GS_ODPS } = GI_ASSETS_PACKAGES;
    if (GI_ASSETS_GS_ODPS) {
      loader([GI_ASSETS_GS_ODPS]).then(res => {
        const assets_deploys = res.map(item => {
          return {
            id: 'deployed',
            name: '我的部署',
            //@ts-ignore
            component: item.deploy,
          };
        }) as DeployItem[];
        updateState(draft => {
          draft.deploys = assets_deploys;
        });
      });
    }
  }, []);

  return (
    <>
      <div className="workspace">
        <Tabs
          tabPosition="left"
          style={{
            background: 'var(--background-color)',
            height: '100%',
            padding: '24px 0px',
            paddingRight: '24px',
            overflow: 'auto',
          }}
          activeKey={activeKey}
          onChange={handleChange}
        >
          {LIST_OPTIONS.map(c => {
            return (
              <TabPane tab={c.name} key={c.id} disabled={c.id === 'deployed'}>
                {c.id === 'case' && <Case />}
                {c.id === 'project' && <ProjectList type={c.id} onCreate={handleOpen} />}
                {c.id === 'save' && <SaveList type={c.id}></SaveList>}
              </TabPane>
            );
          })}
          {deploys.map(c => {
            return (
              <TabPane tab={c.name} key={c.id}>
                {
                  //@ts-ignore
                  c.component && <c.component />
                }
              </TabPane>
            );
          })}
        </Tabs>
      </div>
      <CreatePanel visible={visible} handleClose={handleClose} />
    </>
  );
};

export default Workspace;
