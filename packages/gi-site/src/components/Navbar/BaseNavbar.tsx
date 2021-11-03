import { useHistory } from '@alipay/bigfish';
import { BellOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Avatar, Layout } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';
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
          src="https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*_E3uRppw3PUAAAAAAAAAAAAAARQnAQ"
          alt="logo"
          style={{ height: '30px', marginRight: '40px' }}
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
