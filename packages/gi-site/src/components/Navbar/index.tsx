/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useHistory, useRequest } from '@alipay/bigfish';
import { DatabaseOutlined, ExportOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Drawer, Modal, Tooltip } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectById, updateProjectById } from '../../services';
import DataSource from '../DataSource';
import BaseNavbar from './BaseNavbar';
import ExportConfig from './ExportConfig';
import './index.less';
interface NavbarProps {
  projectId: string;
}
/**
 * 顶部导航
 * @see {NavbarProps}
 * @returns
 */
const Navbar = ({ projectId }: NavbarProps) => {
  const history = useHistory();
  const [visible, setVisible] = React.useState(false);
  const [outVisible, setOutVisible] = React.useState(false);
  const dispatch = useDispatch();
  const { config, isSave, serviceLists } = useSelector(state => state);
  const contentEditable = React.createRef<HTMLSpanElement>();

  const servicesRef = React.useRef({
    options: serviceLists,
  });

  const { data: initProject = {}, run } = useRequest(() => {
    return getProjectById(projectId);
  });

  const handleClose = () => {
    updateProjectById(projectId, {
      serviceLists: servicesRef.current.options,
    });
    setVisible(false);
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
    const info = (await getProjectById(projectId)) as object;

    updateProjectById(projectId, {
      ...info,
      config,
    });

    dispatch({
      type: 'update:config',
      isSave: true,
    });

    Modal.success({
      content: '保存成功',
      onOk() {
        history.push(`/workspace`);
      },
    });
  };

  const changeTitle = async () => {
    const newTitle = contentEditable.current.innerHTML;
    const info = (await getProjectById(projectId)) as object;
    updateProjectById(projectId, {
      ...info,
      title: newTitle,
    });
  };

  const handleKeyDown = e => {
    //禁用回车的默认事件
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const backWorkspace = () => {
    history.push(`/workspace`);
  };

  React.useEffect(() => {
    run();
  }, []);

  const { title } = initProject;

  const menu = (
    <>
      <Tooltip title="保存">
        <Button icon={<SaveOutlined />} onClick={handleSave}></Button>
      </Tooltip>
      <Tooltip title="导出">
        <Button icon={<ExportOutlined />} onClick={handleOutOpen}></Button>
      </Tooltip>
      <Button onClick={backWorkspace}>返回列表</Button>
    </>
  );

  return (
    <BaseNavbar history={history} menu={menu}>
      <span className="navbar-db" onClick={handleOpen}>
        <DatabaseOutlined style={{ padding: '12px 5px', paddingLeft: '0px' }} />
        数据服务
      </span>
      <span
        className="navbar-title"
        ref={contentEditable}
        contentEditable={true}
        onBlur={changeTitle}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
      >
        {title}
      </span>

      <Drawer title="数据服务" placement="right" closable={false} onClose={handleClose} visible={visible} width={'80%'}>
        <DataSource ref={servicesRef} defaultOptions={serviceLists} />
      </Drawer>

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
