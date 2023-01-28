/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { createFromIconfontCN, ExportOutlined, SaveOutlined, FileZipOutlined } from '@ant-design/icons';
import { Button, Drawer, notification, Tooltip } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { useContext } from '../../pages/Analysis/hooks/useContext';
import { addProject, getProjectById, updateProjectById } from '../../services';
import type { IProject } from '../../services/typing';
import ProjectTitle from '../ProjectTitle';
import useTheme from '../ThemeVars/useTheme';

import BaseNavbar from './BaseNavbar';
import ExportConfig from './ExportConfig';
import './index.less';
import type { INavbarState } from './typing';
// import Tour from '../Tour';

interface SvgIconProps {
  type: string; // 必传
  [field: string]: any; // 与antd的icon一致
}
const SvgIcon: React.FC<SvgIconProps> = props => {
  const Icon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_241110_bw0oh2dqbb8.js',
  });
  return <Icon {...props} />;
};

interface NavbarProps {
  projectId: string;
  enableAI: boolean;
  graphRef: React.RefObject<any>;
}
/**
 * 顶部导航
 * @see {NavbarProps}
 * @returns
 */

const Navbar = ({
  //  graphRef
  projectId,
  enableAI,
}: NavbarProps) => {
  const history = useHistory();
  const [state, updateState] = useImmer<INavbarState>({
    exportVisible: false,
    deployVisible: false,
  });

  const { context, updateContext } = useContext();
  const { config, activeAssetsKeys, name } = context;
  // 主题切换Hook
  const { changeTheme } = useTheme(context, updateContext);

  const handleOutClose = () => {
    updateState(draft => {
      draft.exportVisible = false;
    });
  };

  const handleOutOpen = () => {
    updateState(draft => {
      draft.exportVisible = true;
    });
  };

  const handleSave = async () => {
    const origin = (await getProjectById(projectId)) as IProject;

    // TODO：case 的需要保存到另一个表中
    if (origin.type === 'case') {
      const { data = {}, schemaData = {} } = origin;

      const projectId = await addProject({
        name: origin?.name + '_复制',
        type: 'project',
        data,
        schemaData,

        activeAssetsKeys,
        projectConfig: config,
        engineContext: {
          //@ts-ignore
          data: data.transData,
          schemaData,
        },
      });
      history.push(`/workspace/${projectId}?nav=data`);
    } else {
      // const data = graphRef.current && graphRef.current.save();

      updateProjectById(projectId, {
        // data: JSON.stringify({
        //   ...(origin && origin.data),
        //   transData: data,
        // }),
        activeAssetsKeys,
        projectConfig: config,
      });
      // const SERVER_ENGINE_CONTEXT_STRING = localStorage.getItem('SERVER_ENGINE_CONTEXT') || '{}';
      // const SERVER_ENGINE_CONTEXT = JSON.parse(SERVER_ENGINE_CONTEXT_STRING);
      // try {
      //   localStorage.setItem(
      //     'SERVER_ENGINE_CONTEXT',
      //     JSON.stringify({
      //       ...SERVER_ENGINE_CONTEXT,
      //       data: data,
      //     }),
      //   );
      // } catch (error) {
      //   console.log('SERVER_ENGINE_CONTEXT error', error);
      // }
    }
    updateContext(draft => {
      draft.isSave = true;
    });
    notification.success({
      message: '保存成功',
    });
  };

  // 点击智能推荐 Icon
  const handleAiIconClick = () => {
    updateContext(draft => {
      draft.enableAI = !enableAI;
    });
  };
  const handleDownloadProject = async () => {
    const project = (await getProjectById(projectId)) as IProject;
    const { config, name, ...others } = project;
    const params = {
      ...others,
      name,
      projectConfig: config,
      GI_ASSETS_PACKAGES: JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}'),
    };

    const elementA = document.createElement('a');
    elementA.download = name as string;
    elementA.style.display = 'none';
    const blob = new Blob([JSON.stringify(params, null, 2)]);
    elementA.href = URL.createObjectURL(blob);
    document.body.appendChild(elementA);
    elementA.click();
    document.body.removeChild(elementA);
  };
  const rightList = [
    { title: '保存', icon: <SaveOutlined />, onClick: handleSave },
    { title: '下载项目', icon: <FileZipOutlined />, onClick: handleDownloadProject },
    { title: '导出 SDK', icon: <ExportOutlined />, onClick: handleOutOpen },
  ];

  const rightContent = (
    <>
      {rightList.map(item => (
        <Tooltip title={item.title} key={item.title}>
          <Button icon={item.icon} onClick={item.onClick} size="small" className="gi-intro-export">
            {item.title}
          </Button>
        </Tooltip>
      ))}
    </>
  );
  return (
    <BaseNavbar rightContent={rightContent} menuList={[]} onChangeTheme={changeTheme}>
      <ProjectTitle name={name} projectId={projectId} />
      <Drawer
        title="导出SDK"
        placement="right"
        closable={false}
        onClose={handleOutClose}
        visible={state.exportVisible}
        width="calc(100vw - 382px)"
      >
        {state.exportVisible && <ExportConfig></ExportConfig>}
      </Drawer>
    </BaseNavbar>
  );
};

export default Navbar;
