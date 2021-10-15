import { useHistory } from '@alipay/bigfish';
import { Tooltip, Avatar, Layout } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { QuestionCircleOutlined, BellOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Header } = Layout;
const BaseNavbar = props => {
  const history = useHistory();
  const { active = 'workspace' } = props;
  const defaultLeft = (
    <>
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'workspace' && styles.active}>
        <Link to="/workspace">项目列表</Link>
      </div>
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'market' && styles.active}>
        <Link to="/market">资产市场</Link>
      </div>
    </>
  );
  const defaultRight = (
    <>
      <QuestionCircleOutlined style={{ marginRight: 26 }} />
      <BellOutlined style={{ marginRight: 26 }} />
      <Avatar
        style={{ width: '21px', height: '21px' }}
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
      />
    </>
  );

  const { children, leftContent = defaultLeft, rightContent = defaultRight } = props;
  return (
    <Header className={styles.headerContainer}>
      <div className={styles.left}>
        <img
          src="https://gw.alipayobjects.com/zos/bmw-prod/77ceaf76-5315-480f-b285-db12b1507030.svg"
          alt="logo"
          style={{ marginRight: '36px' }}
          onClick={() => {
            history.push('/workspace');
          }}
        />
        {leftContent}
      </div>
      {children}
      <div className={styles.right}>{rightContent}</div>
    </Header>
  );
};

export default BaseNavbar;
