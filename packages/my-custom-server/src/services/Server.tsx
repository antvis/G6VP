import { Button, Radio, Space } from 'antd';
import * as React from 'react';
import { GI_SERVICE_SCHEMA } from './Initializer';
// const { setServerEngineContext } = utils;

/**
 * 设置服务引擎的上下文
 * @returns
 */
export const setServerEngineContext = context => {
  try {
    localStorage.setItem('SERVER_ENGINE_CONTEXT', JSON.stringify(context));
  } catch (error) {
    console.error(error);
  }
};

export interface ServerProps {
  updateGISite: (params: any) => void;
}

const CASE = [
  {
    label: '银行案例数据：https://gw.alipayobjects.com/os/bmw-prod/9f4dda70-b095-4da1-8c64-c0ac063940a2.json',
    value: 'https://gw.alipayobjects.com/os/bmw-prod/9f4dda70-b095-4da1-8c64-c0ac063940a2.json',
  },
  {
    label: '社交网络数据：https://gw.alipayobjects.com/os/bmw-prod/32e879fd-839e-4e7d-8466-57b9133b9696.json',
    value: 'https://gw.alipayobjects.com/os/bmw-prod/32e879fd-839e-4e7d-8466-57b9133b9696.json',
  },
];
const Server: React.FunctionComponent<ServerProps> = props => {
  const { updateGISite } = props;
  const [state, setState] = React.useState({
    value: 'https://gw.alipayobjects.com/os/bmw-prod/9f4dda70-b095-4da1-8c64-c0ac063940a2.json',
  });
  const { value } = state;
  const onChange = e => {
    setState(preState => {
      return {
        ...preState,
        value: e.target.value,
      };
    });
  };

  const handleStart = async () => {
    const engineContext = {
      CASE_URL: value,
    };

    setServerEngineContext(engineContext);

    const schema = await GI_SERVICE_SCHEMA.service();
    updateGISite({
      engineId: 'MyServer',
      schemaData: schema,
      engineContext,
    });
  };

  return (
    <div>
      <Radio.Group onChange={onChange} value={value}>
        <Space direction="vertical">
          {CASE.map(item => {
            return (
              <Radio value={item.value} key={item.value}>
                {item.label}
              </Radio>
            );
          })}
        </Space>
      </Radio.Group>

      <Button onClick={handleStart} type="primary" style={{ marginTop: '12px', display: 'block' }}>
        开始分析
      </Button>
    </div>
  );
};

export default Server;
