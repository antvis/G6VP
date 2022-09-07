import { Tabs } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';

import AlibabaLogin from '../../components/AlibabaLogin';
import DataModeCard from '../../components/DataModeCard';
import BaseNavbar from '../../components/Navbar/BaseNavbar';
import Notification from '../../components/Notification';
import QRcode from '../../components/QRcode';
import { getSearchParams } from '../../components/utils';
import { getAssetPackages } from '../../loader';
import { IS_LOCAL_ENV } from '../../services/const';
import setDefaultDemo from '../X-Studio';
import Case from './Case';
import CreatePanel from './Create';
import './index.less';
import ProjectList from './projectList';
import SaveList from './SaveList';

setDefaultDemo();

interface WorkspaceProps {}
const { TabPane } = Tabs;

/**
 * 硬编码
 *
 */

const GI_ASSETS_GS = window['GI_ASSETS_GS'];
export type NavbarId = 'case' | 'project' | 'save' | 'deployed';
const LIST_DEPLOY: {
  id: NavbarId;
  name: string;
  component: React.ReactNode;
}[] = [];
if (GI_ASSETS_GS && GI_ASSETS_GS.deploy) {
  LIST_DEPLOY.push({
    id: 'deployed',
    name: '我的部署',
    component: GI_ASSETS_GS.deploy,
  });
}

const LIST_OPTIONS: { id: NavbarId; name: string; component?: React.ReactNode }[] = [
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
  ...LIST_DEPLOY,
];

const Workspace: React.FunctionComponent<WorkspaceProps> = props => {
  const { searchParams } = getSearchParams(location);
  const type = searchParams.get('type') || 'project';

  const GI_UPLOADED_DATA = localStorage.getItem('GI_UPLOADED_DATA') === 'true';
  const defaultActiveKey = GI_UPLOADED_DATA ? type : 'case';

  const [state, updateState] = useImmer({
    visible: false,
    activeKey: defaultActiveKey,
    drawerVisible: false,
    version: '',
    content: '',
    isShowMore: false,
    imgUrl: '',
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

  const { visible, activeKey } = state;
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
      {IS_LOCAL_ENV && <AlibabaLogin />}
      <Notification />
      <QRcode />
      <DataModeCard />
    </>
  );

  React.useEffect(() => {
    const packages = getAssetPackages();
    console.log('packages', packages);
  }, []);

  return (
    <>
      <div className="workspace">
        <BaseNavbar rightContentExtra={rightContentExtra}></BaseNavbar>
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
                  {/** @ts-ignore */}
                  {c.id === 'deployed' && c.component && <c.component />}
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
