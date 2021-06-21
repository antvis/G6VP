/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { DatabaseOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import Lockr from 'lockr';
import * as React from 'react';
import DataSource from '../DataSource';
import BaseNavbar from './BaseNavbar';
import './index.less';

const content = (
  <div style={{ width: '100vh' }}>
    <DataSource />
  </div>
);
const Navbar = ({ history }) => {
  const [visible, setVisible] = React.useState(false);
  const handleClose = () => {
    setVisible(false);
  };
  const handleOpen = () => {
    setVisible(true);
  };
  const { id, title, data } = Lockr.get('projectId');

  return (
    <BaseNavbar history={history}>
      <span className="navbar-db" onClick={handleOpen}>
        <DatabaseOutlined style={{ padding: '12px 5px', paddingLeft: '0px' }} /> {title}
      </span>

      <Drawer title="数据服务" placement="right" closable={false} onClose={handleClose} visible={visible} width={'80%'}>
        {visible && <DataSource handleClose={handleClose} />}
      </Drawer>

      <ul className="navbar-action">
        <li>保存</li>
        <li>导出</li>
      </ul>
    </BaseNavbar>
  );
};

export default Navbar;
