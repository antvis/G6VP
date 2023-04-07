import { GithubOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useContext } from '../../pages/Analysis/hooks/useContext';
import DataModeCard from '../DataModeCard';
import Github from './Github';
import Links from './Links';
import Logo from './Logo';

import Theme from './Theme';
import UserInfo from './UserInfo';
interface WorkbookBarProps {
  active: string;
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: ' space-between',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
  },
};

const SiteNav: React.FunctionComponent<WorkbookBarProps> = props => {
  const { active } = props;
  const { context, updateContext } = useContext();
  const history = useHistory();
  const { name } = context;

  const [githubPopVisible, setGithubPopVisible] = React.useState(
    !localStorage.getItem('GITHUB_POP_CLOSED') || localStorage.getItem('GITHUB_POP_CLOSED') === 'false',
  );

  const handleCloseGithubPopover = () => {
    setGithubPopVisible(false);
    localStorage.setItem('GITHUB_POP_CLOSED', 'true');
  };

  const handleJumpToGithub = () => {
    window.open('https://github.com/antvis/G6VP', '_blank');
    handleCloseGithubPopover();
  };

  React.useEffect(() => {
    setTimeout(() => {
      handleCloseGithubPopover();
    }, 10000);
  }, []);

  return (
    <header style={styles.container} className="gi-navbar-container">
      <div style={styles.left}>
        <Logo
          title="AntV Insight"
          handleClick={() => {
            history.push('/home');
          }}
          size={30}
          style={{ padding: '0px 8px', cursor: 'pointer' }}
        />
        <Links active={active} />
      </div>
      <div style={styles.right}>
        <DataModeCard />
        <Theme />
        <Github />
        <UserInfo />
        <Popover
          title="给个鼓励，加个⭐️吧！"
          open={githubPopVisible}
          placement="bottomRight"
          getPopupContainer={node => node}
          overlayStyle={{ marginLeft: '20px' }}
          content={
            <div style={{ textAlign: 'center' }}>
              <Button size="small" onClick={handleCloseGithubPopover}>
                别烦我
              </Button>
              <Button size="small" type="primary" style={{ marginLeft: '4px' }} onClick={handleJumpToGithub}>
                这就去
              </Button>
            </div>
          }
        >
          <span className="gi-header-github-icon" style={{ marginLeft: '4px', width: '32px' }}>
            <a href="http://github.com/antvis/g6vp" target="_blank" rel="noreferrer">
              <GithubOutlined />
            </a>
          </span>
        </Popover>
      </div>
    </header>
  );
};

export default SiteNav;
