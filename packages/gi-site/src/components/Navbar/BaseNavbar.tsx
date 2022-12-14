import { Avatar, Layout, Tooltip } from 'antd';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import useUserInfo from '../../hooks/useUserInfo';
// import ThemeSwitch from '../ThemeSwitch';
import { Icon } from '@antv/gi-sdk';
import ThemeSwitch from '@antv/gi-theme-antd';
import ThemeVars from '../ThemeVars';

import './index.less';

const LOGO_URL = {
  light: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*DsXhSJ1x8DUAAAAAAAAAAAAADmJ7AQ/original',
  dark: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*TawEQ6nGf-AAAAAAAAAAAAAADmJ7AQ/original',
};

const { Header } = Layout;
const BaseNavbar = props => {
  const history = useHistory();
  const { active = 'workspace', onChangeTheme } = props;
  const GI_USER_INFO = useUserInfo() as any;
  const theme = localStorage.getItem('@theme') || 'light';
  const [state, setState] = React.useState({
    logo: LOGO_URL[theme],
  });
  const { logo } = state;

  const handleChangeTheme = val => {
    setState({
      logo: LOGO_URL[val],
    });
    onChangeTheme && onChangeTheme(val);
  };

  const defaultLeft = (
    <>
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'home' ? 'active' : ''}>
        <a href={location.origin + '/home.html'}> 首页</a>
      </div>
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'workspace' ? 'active' : ''}>
        <Link to="/workspace?type=project">我的项目</Link>
      </div>
      {/* <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'market' && styles.active}>
        <Link to="/market">云端研发资产</Link>
      </div> */}
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'assets' ? 'active' : ''}>
        <Link to="/assets">资产中心</Link>
      </div>
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'services' ? 'active' : ''}>
        <Link to="/services">服务中心</Link>
      </div>
    </>
  );

  const { children, leftContent = defaultLeft, rightContent, rightContentExtra = '' } = props;
  return (
    <Header className="gi-navbar-container">
      <div className="left">
        <img
          // src="https://gw.alipayobjects.com/zos/bmw-prod/c2d4b2f5-2a34-4ae5-86c4-df97f7136105.svg"
          src={logo}
          alt="logo"
          style={{ height: '46px', marginRight: '40px', marginLeft: '-24px', cursor: 'pointer' }}
          onClick={() => {
            history.push('/workspace?type=project');
          }}
        />
        {leftContent}
      </div>
      {children}
      <div className="right">
        {rightContentExtra}
        {rightContent}

        <Tooltip title="切换主题">
          <ThemeSwitch
            //@ts-ignore
            themeVars={ThemeVars}
            antdCssLinks={{
              dark: 'https://gw.alipayobjects.com/os/lib/antv/gi-theme-antd/0.1.0/dist/dark.css', //本地调试的时候：'http://127.0.0.1:5500/dark.css',
              light: 'https://gw.alipayobjects.com/os/lib/antv/gi-theme-antd/0.1.0/dist/light.css', //</Tooltip> 'http://127.0.0.1:5500/light.css',
            }}
            onChange={handleChangeTheme}
            options={[
              {
                value: 'light',
                icon: <Icon type="icon-taiyang" />,
              },
              {
                value: 'dark',
                icon: <Icon type="icon-moon_line" />,
              },
            ]}
          ></ThemeSwitch>
        </Tooltip>
        {GI_USER_INFO && (
          <Avatar
            style={{ width: '24px', height: '24px', marginLeft: 8 }}
            src={`https://work.alibaba-inc.com/photo/${GI_USER_INFO && GI_USER_INFO.outUserNo}.220x220.jpg`}
          />
        )}
      </div>
    </Header>
  );
};

export default BaseNavbar;
