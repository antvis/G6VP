import { Button, Input, InputRef } from 'antd';
import * as React from 'react';

export interface ServerComponentProps {}

const ServerComponent: React.FunctionComponent<ServerComponentProps> = props => {
  const [state, setState] = React.useState();
  const inputRef = React.useRef<InputRef>(null);
  React.useEffect(() => {
    const context = {
      projectId: '',
    };
    window.localStorage.setItem('GI_SERVER_CONTEXT', JSON.stringify(context));
  }, []);
  const handleSave = () => {
    console.log('inputRef', inputRef);
  };
  return (
    <div>
      hello ，欢迎来到 GraphInsight 官方数据服务
      <Input placeholder="" ref={inputRef}></Input>
      <Button type="primary" onClick={handleSave}>
        保存
      </Button>
    </div>
  );
};

export default ServerComponent;
