/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import {
  createFromIconfontCN,
  EditOutlined,
  ExportOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Button, Drawer, notification, Tooltip } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useContext } from '../../pages/Analysis/hooks/useContext';
import { schemaData } from '../../pages/Workspace/utils';
import { getProjectById, updateProjectById, addProject } from '../../services';
import Tour from '../Tour';
import BaseNavbar from './BaseNavbar';
import ExportConfig from './ExportConfig';
import './index.less';

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
}
/**
 * 顶部导航
 * @see {NavbarProps}
 * @returns
 */
const Navbar = ({ projectId, enableAI }: NavbarProps) => {
  const history = useHistory();
  const [visible, setVisible] = React.useState(false);
  const [outVisible, setOutVisible] = React.useState(false);
  const [isHover, setIsHover] = React.useState(false);
  const [initProject, setInitProject] = React.useState({});

  const { context, updateContext } = useContext();
  const { config, isSave, serviceConfig, activeAssetsKeys } = context;
  const contentEditable = React.createRef<HTMLSpanElement>();
  const servicesRef = React.useRef({
    options: serviceConfig,
  });

  const handleOutClose = () => {
    setOutVisible(false);
  };

  const handleOutOpen = () => {
    setOutVisible(true);
  };

  const handleSave = async () => {
    const origin = await getProjectById(projectId);
    console.log(origin)
    // @ts-igono
    if (origin.type === 'case') { 
      const projectId = await addProject({
        name: origin?.name,
        type: "project",
        data: JSON.stringify(origin?.data),
        schemaData: JSON.stringify(origin?.schemaData),
        serviceConfig: JSON.stringify(serviceConfig),
        activeAssetsKeys: JSON.stringify(activeAssetsKeys),
        projectConfig: JSON.stringify(config),
      })
      history.push(`/workspace/${projectId}?nav=data`)
    } else {
      updateProjectById(projectId, {
        serviceConfig: JSON.stringify(serviceConfig),
        activeAssetsKeys: JSON.stringify(activeAssetsKeys),
        projectConfig: JSON.stringify(config),
      });
    }
    updateContext(draft => {
      draft.isSave = true;
    });
    notification.success({
      message: '保存成功',
    });
  };

  const changeTitle = async () => {
    const newTitle = contentEditable.current.innerText;
    updateProjectById(projectId, {
      name: newTitle,
    });
  };

  const handleKeyDown = e => {
    //禁用回车的默认事件
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  // 点击智能推荐 Icon
  const handleAiIconClick = () => {
    updateContext(draft => {
      draft.enableAI = !enableAI;
    });
  };
  const handleDownloadProject = async () => {
    const project = await getProjectById(projectId);
    const { config, name, ...others } = project;
    const params = {
      ...others,
      name,
      projectConfig: config,
    };

    const elementA = document.createElement('a');
    elementA.download = name;
    elementA.style.display = 'none';
    const blob = new Blob([JSON.stringify(params, null, 2)]);
    elementA.href = URL.createObjectURL(blob);
    document.body.appendChild(elementA);
    elementA.click();
    document.body.removeChild(elementA);
  };

  React.useEffect(() => {
    (async () => {
      const project = await getProjectById(projectId);
      setInitProject(project);
    })();
  }, []);
  //@ts-ignore
  const { name } = initProject;
  const rightContent = (
    <>
      <Tooltip title="保存">
        <Button icon={<SaveOutlined />} onClick={handleSave} size="small" className="gi-intro-save">
          保存
        </Button>
      </Tooltip>
      <Tooltip title="下载项目">
        <Button icon={<SaveOutlined />} onClick={handleDownloadProject} size="small" className="gi-intro-save">
          下载项目
        </Button>
      </Tooltip>
      <Tooltip title="导出 SDK">
        <Button icon={<ExportOutlined />} onClick={handleOutOpen} size="small" className="gi-intro-export">
          导出 SDK
        </Button>
      </Tooltip>
      {/* <Tooltip title="自动推荐样式">
        <Button onClick={handleAiIconClick} size="small">
          <SvgIcon type="icon-magic1" style={{ color: enableAI ? '#3471f9' : '' }} />
        </Button>
      </Tooltip> */}
      <Tooltip title="指引手册">
        <Tour />
      </Tooltip>
    </>
  );
  return (
    <BaseNavbar rightContent={rightContent} leftContent={<></>}>
      <span
        className="navbar-title"
        ref={contentEditable}
        contentEditable={true}
        onBlur={changeTitle}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {name}
        <EditOutlined style={{ display: isHover ? 'inline-block' : 'none', marginLeft: 5 }} />
      </span>

      <Drawer
        title="导出配置"
        placement="right"
        closable={false}
        onClose={handleOutClose}
        visible={outVisible}
        width="calc(100vw - 382px)"
      >
        {outVisible && <ExportConfig></ExportConfig>}
      </Drawer>
    </BaseNavbar>
  );
};

export default Navbar;
