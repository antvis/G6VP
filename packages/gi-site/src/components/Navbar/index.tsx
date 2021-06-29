/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { DatabaseOutlined, SaveOutlined, ExportOutlined } from '@ant-design/icons';
import { Drawer, Tooltip, Button, Modal } from 'antd';
import Lockr from 'lockr';
import * as React from 'react';
import { useSelector } from 'react-redux';
import ExportConfig from './ExportConfig';
import DataSource from '../DataSource';
import BaseNavbar from './BaseNavbar';
import './index.less';

const Navbar = ({ history, projectId, clickSave }) => {
  const [visible, setVisible] = React.useState(false);
  const [outVisible, setOutVisible] = React.useState(false);
  const config = useSelector(state => state.config);
  const contentEditable = React.createRef();

  const handleClose = () => {
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

  const handleSave = () => {
    clickSave();

    const info = Lockr.get(projectId);
    Lockr.set(projectId, {
      ...info,
      config,
    });

    Modal.success({
      content: '保存成功',
      onOk() {
        history.push(`/workspace`);
      },
    });
  };

  const changeTitle = () => {
    const newTitle = contentEditable.current.innerHTML;
    const info = Lockr.get(projectId);
    Lockr.set(projectId, {
      ...info,
      title: newTitle,
    });
  };

  const backWorkspace = () => {
    history.push(`/workspace`);
  };

  const { title } = Lockr.get(projectId);

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
      </span>
      <span
        className="navbar-title"
        ref={contentEditable}
        contentEditable={true}
        onBlur={changeTitle}
        suppressContentEditableWarning={true}
      >
        {title}
      </span>
      <Drawer title="数据服务" placement="right" closable={false} onClose={handleClose} visible={visible} width={'80%'}>
        {visible && <DataSource handleClose={handleClose} />}
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
