import ThemeSwitch from '@alipay/theme-tools';
import { Avatar, Layout, Tooltip } from 'antd';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import useUserInfo from '../../hooks/useUserInfo';
import ThemeVars from '../ThemeVars';
//@ts-ignore
import styles from './index.less';

const { Header } = Layout;
const BaseNavbar = props => {
  const history = useHistory();
  const { active = 'workspace' } = props;
  const userInfo = useUserInfo() as any;

  const defaultLeft = (
    <>
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'home' && styles.active}>
        <a href={location.origin + '/home.html'}> 首页</a>
      </div>
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'workspace' && styles.active}>
        <Link to="/workspace?type=project">项目列表</Link>
      </div>
      {/* <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'market' && styles.active}>
        <Link to="/market">云端研发资产</Link>
      </div> */}
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'assets' && styles.active}>
        <Link to="/assets">本地研发</Link>
      </div>
    </>
  );

  const { children, leftContent = defaultLeft, rightContent, rightContentExtra = '' } = props;
  return (
    <Header className={styles.headerContainer}>
      <div className={styles.left}>
        <img
          src="https://gw.alipayobjects.com/zos/bmw-prod/c2d4b2f5-2a34-4ae5-86c4-df97f7136105.svg"
          alt="logo"
          style={{ height: '30px', marginRight: '40px', cursor: 'pointer' }}
          onClick={() => {
            history.push('/workspace?type=project');
          }}
        />
        {leftContent}
      </div>
      {children}
      <div className={styles.right}>
        {rightContentExtra}
        {rightContent}

        {userInfo && (
          <Avatar
            style={{ width: '21px', height: '21px', marginLeft: 5 }}
            src={`https://work.alibaba-inc.com/photo/${userInfo && userInfo.outUserNo}.220x220.jpg`}
          />
        )}
        <Tooltip title="切换主题">
          <ThemeSwitch
            themeVars={ThemeVars}
            antdCssLinks={{
              dark: 'https://gw.alipayobjects.com/os/lib/alipay/theme-tools/0.3.0/dist/GraphInsight/dark.css',
              light: ' https://gw.alipayobjects.com/os/lib/alipay/theme-tools/0.3.0/dist/GraphInsight/light.css',
            }}
          ></ThemeSwitch>
        </Tooltip>
      </div>
    </Header>
  );
};

export default BaseNavbar;
