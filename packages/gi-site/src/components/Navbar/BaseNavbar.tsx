import ThemeSwitch from '@alipay/theme-tools';
import { BellOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Avatar, Layout, Tooltip } from 'antd';
import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import useUserInfo from '../../hooks/useUserInfo';
import ThemeVars from '../ThemeVars';
//@ts-ignore
import styles from './index.less';

const { Header } = Layout;
const BaseNavbar = props => {
  const history = useHistory();
  const { active = 'workspace' } = props;
  const userInfo = useUserInfo();

  const defaultLeft = (
    <>
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'home' && styles.active}>
        <Link to="/">首页</Link>
      </div>
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'workspace' && styles.active}>
        <Link to="/workspace">项目列表</Link>
      </div>
      {/* <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'market' && styles.active}>
        <Link to="/market">云端研发资产</Link>
      </div> */}
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'assets' && styles.active}>
        <Link to="/assets">本地研发资产</Link>
      </div>
    </>
  );
  const defaultRight = (
    <>
      <QuestionCircleOutlined style={{ marginRight: 26 }} />
      <BellOutlined style={{ marginRight: 26 }} />
      <span>{userInfo && userInfo.nickName}</span>
    </>
  );

  const { children, leftContent = defaultLeft, rightContent = defaultRight, rightContentExtra = '' } = props;
  return (
    <Header className={styles.headerContainer}>
      <div className={styles.left}>
        <img
          src="https://gw.alipayobjects.com/zos/bmw-prod/c2d4b2f5-2a34-4ae5-86c4-df97f7136105.svg"
          alt="logo"
          style={{ height: '30px', marginRight: '40px' }}
          onClick={() => {
            history.push('/workspace');
          }}
        />
        {leftContent}
      </div>
      {children}
      <div className={styles.right}>
        {rightContentExtra}
        {rightContent}
        <Avatar
          style={{ width: '21px', height: '21px', marginLeft: 5 }}
          src={`https://work.alibaba-inc.com/photo/${userInfo && userInfo.outUserNo}.220x220.jpg`}
        />
        <Tooltip title="切换主题">
          <ThemeSwitch
            themeVars={ThemeVars}
            antdCssLinks={{
              dark: 'https://gw.alipayobjects.com/os/lib/alipay/theme-tools/0.2.3/dist/GraphInsight/dark.css',
              light: ' https://gw.alipayobjects.com/os/lib/alipay/theme-tools/0.2.3/dist/GraphInsight/light.css',
            }}
          ></ThemeSwitch>
        </Tooltip>
      </div>
    </Header>
  );
};

export default BaseNavbar;
