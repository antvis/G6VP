import { utils } from '@antv/gi-sdk';
import { notification } from 'antd';
import request from 'umi-request';
import $i18n from '../i18n';

export const connectTuGraphDataSource = async () => {
  const { username, password, engineServerURL, HTTP_SERVICE_URL } = utils.getServerEngineContext();
  const result = await request(`${HTTP_SERVICE_URL}/api/tugraph/connect`, {
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
      message: $i18n.get({
        id: 'tugraph.src.services.TuGraphService.FailedToConnectToTugraph',
        dm: '连接 TuGraph 数据库失败',
      }),
      style: {
        width: 500,
      },
      description: $i18n.get({
        id: 'tugraph.src.services.TuGraphService.CheckWhetherTheAntvisGi',
        dm: '✅ 请检查 antvis/gi-httpservice 镜像是否启动 <br />✅ 请检查 {engineId} 数据库地址，账户，密码是否填写正确',
      }),
    });
    return result;
  }

  notification.success({
    message: $i18n.get({
      id: 'tugraph.src.services.TuGraphService.ConnectionToDatabaseTugraphSucceeded',
      dm: '连接 TuGraph 数据库成功',
    }),
    description: $i18n.get({
      id: 'tugraph.src.services.TuGraphService.ContinueToSelectSubgraphsAnd',
      dm: '请继续选择子图，进入分析',
    }),
  });

  const { data } = result;
  utils.setServerEngineContext({
    ENGINE_USER_TOKEN: `Bearer ${data.jwt}`,
  });
  return result;
};

export const querySubGraphList = async () => {
  const { ENGINE_USER_TOKEN, HTTP_SERVICE_URL } = utils.getServerEngineContext();

  const result = await request(`${HTTP_SERVICE_URL}/api/tugraph/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: ENGINE_USER_TOKEN,
    },
  });
  if (result && result.success) {
    return result.data;
  } else {
    return [];
  }
};

export const queryVertexLabelCount = async () => {
  const { ENGINE_USER_TOKEN, HTTP_SERVICE_URL, CURRENT_SUBGRAPH } = utils.getServerEngineContext();

  const result = await request(`${HTTP_SERVICE_URL}/api/tugraph/count`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: ENGINE_USER_TOKEN,
    },
    params: {
      graphName: CURRENT_SUBGRAPH,
    },
  });
  if (result.success) {
    return result.data;
  }

  return {
    nodeCount: '-',
    edgeCount: '-',
  };
};
