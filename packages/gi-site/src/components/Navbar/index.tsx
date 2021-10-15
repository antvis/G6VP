/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useHistory, useRequest } from '@alipay/bigfish';
import { DatabaseOutlined, ExportOutlined, SaveOutlined, createFromIconfontCN } from '@ant-design/icons';
import { Button, Drawer, Modal, Tooltip } from 'antd';
import ThemeSwitch from '@alipay/theme-tools';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ThemeVars from '../ThemeVars';
import { getProjectById, updateProjectById } from '../../services';
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
  const dispatch = useDispatch();
  const { config, isSave, serviceConfig } = useSelector(state => state);
  const contentEditable = React.createRef<HTMLSpanElement>();
  const servicesRef = React.useRef({
    options: serviceConfig,
  });

  const { data: initProject = {}, run } = useRequest(() => {
    return getProjectById(projectId);
  });

  const handleClose = () => {
    updateProjectById(projectId, {
      serviceConfig: JSON.stringify(servicesRef.current.options),
    }).then(res => {
      dispatch({
        type: 'update:key',
        key: Math.random(),
      });
      setVisible(false);
    });
  };

  const handleOpen = () => {
    setVisible(true);
  };

  const handleOutClose = () => {
    setOutVisible(false);
  };

  const handleOutOpen = () => {
    setOutVisible(true);
  };

  const handleSave = async () => {
    updateProjectById(projectId, {
      projectConfig: JSON.stringify(config),
    });

    dispatch({
      type: 'update:config',
      isSave: true,
    });

    Modal.success({
      content: '保存成功',
      onOk() {
        // history.push(`/workspace`);
      },
    });
  };

  const changeTitle = async () => {
    const newTitle = contentEditable.current.innerHTML;

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
    dispatch({
      type: 'update:enableAI',
      enableAI: !enableAI,
    });
  };

  React.useEffect(() => {
    run();
  }, []);

  const { name } = initProject;
  const rightContent = (
    <>
      <Tooltip title="保存">
        <Button icon={<SaveOutlined />} onClick={handleSave}>
          保存
        </Button>
      </Tooltip>
      <Tooltip title="导出">
        <Button icon={<ExportOutlined />} onClick={handleOutOpen}>
          导出
        </Button>
      </Tooltip>
      <Tooltip title="自动推荐样式">
        <Button onClick={handleAiIconClick}>
          <SvgIcon type="icon-magic1" style={{ color: enableAI ? '#3471f9' : '' }} />
        </Button>
      </Tooltip>
      <Tooltip title="切换主题">
        <ThemeSwitch
          themeVars={ThemeVars}
          antdCssLinks={{
            dark: 'https://gw.alipayobjects.com/os/lib/alipay/theme-tools/0.2.0/dist/GraphInsight/dark.css',
            light: ' https://gw.alipayobjects.com/os/lib/alipay/theme-tools/0.2.0/dist/GraphInsight/light.css',
          }}
        ></ThemeSwitch>
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
      >
        {name}
      </span>

      <Drawer
        title="导出配置"
        placement="right"
        closable={false}
        onClose={handleOutClose}
        visible={outVisible}
        width={'50%'}
      >
        {outVisible && <ExportConfig></ExportConfig>}
      </Drawer>
    </BaseNavbar>
  );
};

export default Navbar;
