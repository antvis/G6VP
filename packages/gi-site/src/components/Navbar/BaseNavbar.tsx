/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { UserOutlined, BgColorsOutlined, PlayCircleOutlined } from '@ant-design/icons';
import './index.less';

const BaseNavbar = props => {
  const { history, children, menu, hasPublish = false, handlePublish = null } = props;
  return (
    <div className="navbar">
      <div
        className="navbar-logo"
        onClick={() => {
          history.push('/');
        }}
      >
        <img src="https://gw.alipayobjects.com/zos/bmw-prod/77ceaf76-5315-480f-b285-db12b1507030.svg" alt="logo" />
      </div>
      {children}
      <div className="navbar-menu">
        {menu}
        {hasPublish && (
          <Button onClick={handlePublish} icon={<PlayCircleOutlined />}>
            发布
          </Button>
        )}
        <Tooltip title="切换主题">
          <Button icon={<BgColorsOutlined />}></Button>
        </Tooltip>
        <Button icon={<UserOutlined />}></Button>
      </div>
    </div>
  );
};

export default BaseNavbar;
