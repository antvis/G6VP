import { utils } from '@antv/gi-sdk';
import { notification } from 'antd';
import { formatterCypherResult } from './ServerComponent/utils';
import request from 'umi-request';
import $i18n from '../i18n';

export const NeighborsQuery = {
  name: $i18n.get({ id: 'galaxybase.src.services.NeighborsQuery.NeighborQuery', dm: '邻居查询' }),
  service: async params => {
    const { GALAXYBASE_USER_TOKEN, HTTP_SERVICE_URL, CURRENT_GALAXYBASE_SUBGRAPH } = utils.getServerEngineContext();
    let { ids, sep, limit } = params;
    const response = await request(`${HTTP_SERVICE_URL}/api/cypher/commit`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: GALAXYBASE_USER_TOKEN,
      },
      data: JSON.stringify({
        statements: [
          {
            statement: `cypher match p=(a)-[*1..${sep}]-() where id(a) in [${ids}] return p`,
            resultDataContents: ['graph'],
          },
        ],

        graphName: CURRENT_GALAXYBASE_SUBGRAPH,
      }),
    });
    const { status, success, errors, results } = response;
    if (!success && errors && errors.length > 0) {
      notification.error({
        message: $i18n.get({
          id: 'galaxybase.src.services.NeighborsQuery.FailedToExecuteCypherQuery',
          dm: '执行 Cypher 查询失败',
        }),
        description: $i18n.get(
          {
            id: 'galaxybase.src.services.NeighborsQuery.QueryFailedErrorsmessage',
            dm: '查询失败：{errorsMessage}',
          },
          { errorsMessage: errors[0].message },
        ),
      });
      return {
        nodes: [],
        edges: [],
      };
    }
    if (status === 412) {
      notification.error({
        message: $i18n.get({
          id: 'galaxybase.src.services.NeighborsQuery.EngineAuthenticationFailedCheckThe',
          dm: '引擎认证失败：请检查数据集',
        }),
        description: errors[0].message,
      });
      return {
        nodes: [],
        edges: [],
      };
    }

    let { nodes, edges } = formatterCypherResult(results);

    return {
      nodes,
      edges,
    };
  },
};
