import { utils } from '@antv/gi-sdk';
import { message } from 'antd';
import request from 'umi-request';
import { refreshToken } from './TuGraphService';
export const GI_SERVICE_INTIAL_GRAPH = {
  name: '初始化查询',
  service: async () => {
    return new Promise(resolve => {
      resolve({
        nodes: [],
        edges: [],
      });
    });
  },
};

export const GI_SERVICE_SCHEMA = {
  name: '查询图模型',
  service: async () => {
    const { ENGINE_USER_TOKEN, HTTP_SERVICE_URL, CURRENT_SUBGRAPH } = utils.getServerEngineContext();

    if (!ENGINE_USER_TOKEN) {
      // 没有登录信息，需要先登录再查询 schema
      message.error(
        `TuGraph 数据源连接失败: 没有获取到连接 TuGraph 数据库的 Token 信息，请先连接 TuGraph 数据库再进行尝试！`,
      );
      return;
    }

    try {
      const result = await request(HTTP_SERVICE_URL + '/api/tugraph/schema', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: ENGINE_USER_TOKEN,
        },
        params: {
          graphName: CURRENT_SUBGRAPH,
        },
      });
      const { success, data } = result;
      if (!success) {
        return {
          nodes: [],
          edges: [],
        };
      }
      if (data.error_message) {
        refreshToken();
        return {
          nodes: [],
          edges: [],
        };
      }
      return data;
    } catch (error) {
      console.error('error', error);
      return {
        nodes: [],
        edges: [],
      };
    }
  },
};
