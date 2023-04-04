import { GithubOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import * as React from 'react';
interface GithubProps {}

const Github: React.FunctionComponent<GithubProps> = props => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    fetch('https://api.github.com/repos/antvis/G6VP')
      .then(res => {
        return res.json();
      })
      .then(res => {
        setCount(res.stargazers_count);
      });
  }, []);
  const handleClick = () => {
    window.open('https://github.com/antvis/G6VP', '_target');
  };
  return (
    <div>
      <Tooltip
        placement="bottomLeft"
        title={'项目已开源，如果有帮助，还请帮忙点个小🌟🌟 让更多用户看见～'}
        color={'var(--primary-color)'}
      >
        <Button type="text" icon={<GithubOutlined />} onClick={handleClick}>
          {` ${count}`}
        </Button>
      </Tooltip>
    </div>
  );
};

export default Github;
