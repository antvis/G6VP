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

export const refreshToken = async () => {
  const { ENGINE_USER_TOKEN, HTTP_SERVICE_URL, GI_SITE_PROJECT_ID, username, password, engineServerURL } =
    utils.getServerEngineContext();
  const result = await request(`${HTTP_SERVICE_URL}/api/tugraph/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: 'application/json; charset=UTF-8',
      Authorization: ENGINE_USER_TOKEN,
    },
  }).catch(error => {});

  if (!result || !result.success) {
    notification.error({
      message: `连接 TuGraph 数据库失败`,
    });
    return result;
  }
  const { data } = result;

  utils.setServerEngineContext({
    ENGINE_USER_TOKEN: `Bearer ${data.jwt}`,
  });

  try {
    //@ts-ignore
    const { datasetId } = await window.GI_PROJECT_DB.getItem(GI_SITE_PROJECT_ID);
    // 找到 数据集
    //@ts-ignore
    const ctx = await window.GI_DATASET_DB.getItem(datasetId);
    // 变量a就是该数据集的全部信息，修改它的 ENGINE_USER_TOKEN
    ctx.engineContext.ENGINE_USER_TOKEN = `Bearer ${data.jwt}`;
    //重新设置回数据集中
    //@ts-ignore
    await window.GI_DATASET_DB.setItem(datasetId, ctx);
    notification.error({
      message: '重新认证成功，请刷新页面',
    });
    window.location.reload();
  } catch (error) {}

  return {
    nodes: [],
    edges: [],
  };
};
