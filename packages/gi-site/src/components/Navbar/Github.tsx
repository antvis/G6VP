import { GithubOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import * as React from 'react';
import { fetch } from 'umi-request';
import $i18n from '../../i18n';
import './github.less';
interface GithubProps {}

const Github: React.FunctionComponent<GithubProps> = props => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    fetch('https://api.github.com/repos/antvis/G6VP')
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.stargazers_count) setCount(res.stargazers_count);
      });
  }, []);

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
  const otherProps = githubPopVisible
    ? {
        open: githubPopVisible,
      }
    : {};

  return (
    <Popover
      style={{ width: '400px' }}
      trigger="hover"
      title={$i18n.get({
        id: 'gi-site.components.Navbar.Github.OpenSourceIsNotEasy',
        dm: '开源不易，给个鼓励，加个 ⭐️ 吧！',
      })}
      {...otherProps}
      placement="bottomRight"
      overlayStyle={{ marginLeft: '20px' }}
      content={
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <Button size="small" onClick={handleCloseGithubPopover}>
            {$i18n.get({ id: 'gi-site.components.Navbar.Github.LeaveMeAlone', dm: '别烦我' })}
          </Button>
          <Button size="small" type="primary" style={{ marginLeft: '8px' }} onClick={handleJumpToGithub}>
            {$i18n.get({ id: 'gi-site.components.Navbar.Github.RightAway', dm: '这就去' })}
          </Button>
        </div>
      }
    >
      <Button
        type="text"
        size="small"
        icon={<GithubOutlined />}
        onClick={() => {
          window.open('http://github.com/antvis/g6vp');
        }}
      >
        {count ? ` ${count}` : ''}
      </Button>
    </Popover>
  );
};

export default Github;
