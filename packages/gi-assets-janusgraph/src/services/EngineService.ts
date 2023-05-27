import { utils } from '@antv/gi-sdk';
import { notification } from 'antd';
import request from 'umi-request';

export const connect = async () => {
  const { username, password, engineServerURL, HTTP_SERVICE_URL } = utils.getServerEngineContext();
  const result = await request(`${HTTP_SERVICE_URL}/gremlin/connect`, {
    method: 'POST',
    data: {
      username,
      password,
      serverUrl: engineServerURL,
    },
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: 'application/json; charset=UTF-8',
    },
  }).catch(error => {});

  if (!result || !result.success) {
    notification.error({
      message: `连接数据库失败`,
      style: {
        width: 500,
      },
      description: `✅ 请检查 antvis/gi-httpservice 代理服务是否启动 <br />✅ 请检查数据库地址，账户，密码是否填写正确`,
    });
    return result;
  }

  notification.success({
    message: `连接数据库成功`,
    description: '请继续选择子图，进入分析',
  });

  const { data } = result;
  utils.setServerEngineContext({
    ENGINE_USER_TOKEN: `Bearer ${Math.random()}`,
  });
  return result;
};

export const querySubGraphList = async () => {
  return [
    {
      value: 'default',
      title: 'default',
    },
  ];
};

export const queryVertexLabelCount = async (graphName: string) => {
  return {
    nodeCount: '-',
    edgeCount: '-',
  };
};
