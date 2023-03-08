import { utils } from '@antv/gi-sdk';
import { message } from 'antd';
import request from 'umi-request';
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
    let res = {
      nodes: [],
      edges: [],
    };
    const serverEngineContext = utils.getServerEngineContext();

    const token = serverEngineContext.uri;
    if (!token) {
      // 没有登录信息，需要先登录再查询 schema
      message.error(
        `HugeGraph 数据源连接失败: 没有获取到连接 HugeGraph 数据库的连接信息，请先连接 HugeGraph 数据库再进行尝试！`,
      );
      return;
    }

    try {
      const httpServerURL = serverEngineContext.httpServerURL;
      const result = await request(`${httpServerURL}/graphs/hugegraph/schema`, {
        method: 'GET',
      });

      if (result.success) {
        res = result.data;
      }
      return res;
    } catch (e) {
      message.error(`图模型查询失败: ${e}`);
    }
    return res;
  },
};
