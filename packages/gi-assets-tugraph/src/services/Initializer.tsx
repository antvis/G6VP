import { utils } from '@antv/gi-sdk';
import { message } from 'antd';
import request from 'umi-request';
import $i18n from '../i18n';

import { CypherQuery } from './CypherQuery';
import { refreshToken } from './TuGraphService';

export const GI_SERVICE_INTIAL_GRAPH = {
  name: $i18n.get({ id: 'tugraph.src.services.Initializer.InitializeAQuery', dm: '初始化查询' }),
  service: async () => {
    const cypher = utils.searchParamOf('cypher');

    if (cypher) {
      return CypherQuery.service({
        value: cypher,
        limit: 500,
      });
    }
    return new Promise(resolve => {
      resolve({
        nodes: [],
        edges: [],
      });
    });
  },
};

export const GI_SERVICE_SCHEMA = {
  name: $i18n.get({ id: 'tugraph.src.services.Initializer.QueryGraphModel', dm: '查询图模型' }),
  service: async () => {
    const { ENGINE_USER_TOKEN, HTTP_SERVICE_URL, CURRENT_SUBGRAPH } = utils.getServerEngineContext();

    if (!ENGINE_USER_TOKEN) {
      // 没有登录信息，需要先登录再查询 schema
      message.error(
        $i18n.get({
          id: 'tugraph.src.services.Initializer.TugraphDataSourceConnectionFailed',
          dm: 'TuGraph 数据源连接失败: 没有获取到连接 TuGraph 数据库的 Token 信息，请先连接 TuGraph 数据库再进行尝试！',
        }),
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

      const { success, data, code } = result;

      if (!success) {
        if (code === 401) {
          refreshToken();
        }
        return {
          nodes: [],
          edges: [],
        };
      }
      return data;
    } catch (error) {
      return {
        nodes: [],
        edges: [],
      };
    }
  },
};
