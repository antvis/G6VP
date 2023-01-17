import { Button, Drawer } from 'antd';
import * as React from 'react';
import Server from '../services/Server';

interface ServerViewProps {}

const ServerView: React.FunctionComponent<ServerViewProps> = props => {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        自定义服务：连接引擎
      </Button>
      <Drawer
        title="模拟 G6VP 平台的导入数据"
        open={open}
        width={'80%'}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Server
          updateGISite={() => {
            location.reload();
          }}
        />
      </Drawer>
    </>
  );
};

export default ServerView;
