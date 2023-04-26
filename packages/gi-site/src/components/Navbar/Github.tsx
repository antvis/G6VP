import { GithubOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import * as React from 'react';
import { fetch } from 'umi-request';
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

  return (
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
      <span className="gi-header-github-icon">
        <a href="http://github.com/antvis/g6vp" target="_blank" rel="noreferrer" style={{ marginRight: '4px' }}>
          <GithubOutlined />
        </a>
        {count ? ` ${count}` : ''}
      </span>
    </Popover>
  );
};

export default Github;
