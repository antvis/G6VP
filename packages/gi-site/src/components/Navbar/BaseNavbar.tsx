/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import ThemeSwitch from '@alipay/theme-tools';
import { useHistory } from '@alipay/bigfish';
import { Tooltip, Avatar, Layout } from 'antd';
import * as React from 'react';
import ThemeVars from '../ThemeVars';
import styles from './index.less';

const { Header } = Layout;
const BaseNavbar = props => {
  const history = useHistory();
  const { children, leftContent, rightContent } = props;
  return (
    <Header className={styles.headerContainer}>
      <div className={styles.left}>
        <img
          src="https://gw.alipayobjects.com/zos/bmw-prod/77ceaf76-5315-480f-b285-db12b1507030.svg"
          alt="logo"
          style={{ marginRight: '36px' }}
          onClick={() => {
            history.push('/');
          }}
        />
        {leftContent}
      </div>
      {children}
      <div className={styles.right}>
        {rightContent}
        <Tooltip title="切换主题">
          <ThemeSwitch
            themeVars={ThemeVars}
            antdCssLinks={{
              dark: 'https://gw.alipayobjects.com/os/lib/alipay/theme-tools/0.2.0/dist/GraphInsight/dark.css',
              light: ' https://gw.alipayobjects.com/os/lib/alipay/theme-tools/0.2.0/dist/GraphInsight/light.css',
            }}
          ></ThemeSwitch>
        </Tooltip>
        <Avatar
          style={{ width: '21px', height: '21px' }}
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
      </div>
    </Header>
  );
};

export default BaseNavbar;
