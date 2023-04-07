import { utils } from '@antv/gi-sdk';
import { notification } from 'antd';
import { formatterCypherResult } from './ServerComponent/utils'
import request from 'umi-request';

export const NeighborsQuery = {
  name: '邻居查询',
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
            statement: `cypher runtime = high_performance match p=(a)-[*1..${sep}]-() where id(a) in [${ids}] return p`,
            resultDataContents: ['graph'],
          },
        ],
        graphName: CURRENT_GALAXYBASE_SUBGRAPH,
      }),
    });
    const { status, success, errors, results } = response;
    if (!success) {
      notification.error({
        message: '执行 Cypher 查询失败',
        description: `查询失败：${errors[0].message}`,
      });
      return {
        nodes: [],
        edges: [],
      };
    }
    if (status === 412) {
      notification.error({
        message: '引擎认证失败：请检查数据集',
        description: errors[0].message,
      });
      return {
        nodes: [],
        edges: [],
      };
    }

    let { nodes, edges } = formatterCypherResult(results)

    return {
      nodes,edges
    };
  },
};
