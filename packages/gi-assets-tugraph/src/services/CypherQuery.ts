import { utils } from '@antv/gi-sdk';
import { notification } from 'antd';
import request from 'umi-request';
import $i18n from '../i18n';

export const CypherQuery = {
  name: $i18n.get({ id: 'tugraph.src.services.CypherQuery.GraphStatementQuery', dm: '图语句查询' }),
  service: async (params = {}) => {
    const { value, limit } = params as any;
    const { ENGINE_USER_TOKEN, CURRENT_SUBGRAPH, HTTP_SERVICE_URL } = utils.getServerEngineContext();

    // const graphName = localStorage.getItem('CURRENT_SUBGRAPH') || 'default';

    const response = await request(`${HTTP_SERVICE_URL}/api/tugraph/languagequery`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: ENGINE_USER_TOKEN,
      },
      data: {
        value,
        graphName: CURRENT_SUBGRAPH,
        limit,
      },
    });
    const { data, success, message } = response;
    if (!success) {
      notification.error({
        message: $i18n.get({
          id: 'tugraph.src.services.CypherQuery.FailedToExecuteCypherQuery',
          dm: '执行 Cypher 查询失败',
        }),
        description: $i18n.get(
          {
            id: 'tugraph.src.services.CypherQuery.QueryFailedMessage',
            dm: '查询失败：{message}',
          },
          { message: message },
        ),
      });
      return {
        nodes: [],
        edges: [],
      };
    }
    if (data.error_message) {
      notification.error({
        message: $i18n.get({
          id: 'tugraph.src.services.CypherQuery.EngineAuthenticationFailedCheckThe',
          dm: '引擎认证失败：请检查数据集',
        }),
        description: data.error_message,
      });
      return {
        nodes: [],
        edges: [],
      };
    }

    return data;
  },
};
