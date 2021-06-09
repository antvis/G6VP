/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { DatabaseOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import * as React from 'react';
import DataSource from '../DataSource';
import './index.less';

const content = (
  <div style={{ width: '100vh' }}>
    <DataSource />
  </div>
);
const Navbar = () => {
  const [visible, setVisible] = React.useState(false);
  const handleClose = () => {
    setVisible(false);
  };
  const handleOpen = () => {
    setVisible(true);
  };
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src="https://gw.alipayobjects.com/zos/bmw-prod/77ceaf76-5315-480f-b285-db12b1507030.svg" alt="logo" />
      </div>

      <Popover placement="bottomLeft" title={''} content={content} trigger="click">
        <span className="navbar-db" onClick={handleOpen}>
          <DatabaseOutlined style={{ padding: '12px 5px', paddingLeft: '0px' }} /> 燎原项目
        </span>
      </Popover>

      <ul className="navbar-action">
        <li>主题</li>
        <li>保存</li>
        <li>导出</li>
      </ul>
    </div>
  );
};

export default Navbar;
