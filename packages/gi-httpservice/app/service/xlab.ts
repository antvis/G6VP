import { Service } from 'egg';
// import fs from 'fs';
// import { getNodeIds, getNodeIdsByEids } from '../tugraph.utils';
// import { readTuGraphConfig } from '../util';
// import { ILanguageQueryParams, INeighborsParams } from './serviceInterface';

class XlabService extends Service {
  /**
   * 查询节点属性详情
   * @param params 节点 ID
   */
  async queryElementProperties(params) {
    const { id = [], schemaType, engineServerURL, Authorization } = params;
    if (!id.length) {
      return {
        success: false,
        code: 200,
        message: '未指定查询 id',
        data: {},
      };
    }
    const interfaceName = schemaType === 'repo' ? 'repo_detail' : 'user_detail';

    const result = await this.ctx.curl(`${engineServerURL}/db/default/xlab/${interfaceName}`, {
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
        Authorization,
      },
      data: `{"data": "{\\"id\\": [${id}]}"}`,
      method: 'POST',
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (result.status !== 200) {
      const data = { ...result.data };
      if (data.created_at !== undefined) {
        data.created_at = data.created_at * 1000;
      }
      if (data.properties?.created_at !== undefined) {
        data.properties.created_at = data.properties.created_at * 1000;
      }

      return {
        success: false,
        code: result.status,
        data,
      };
    }
    return {
      data: result.data,
      code: 200,
      success: true,
    };
  }

  async fuzzyQuery(params) {
    const { name, isUser, engineServerURL, Authorization } = params;
    if (!name) {
      return {
        success: false,
        code: 200,
        message: '未指定查询内容',
        data: {},
      };
    }

    const result = await this.ctx.curl(`${engineServerURL}/db/default/xlab/fuzzy_query`, {
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
        Authorization,
      },
      data: `{"data": "{\\"name\\": \\"${name}\\", \\"is_user\\": ${isUser}}"}`,
      method: 'POST',
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (result.status !== 200) {
      const { nodes = [], edges = [] } = result.data;
      const data: any = { nodes: [], edges: [] };
      nodes.forEach(node => {
        const { created_at } = node.properties;
        if (created_at !== undefined) {
          data.nodes.push({
            ...node,
            properties: {
              ...node.properties,
              created_at: created_at * 1000,
            },
            created_at: created_at * 1000,
          });
        } else {
          data.nodes.push(node);
        }
      });
      edges.forEach(edge => {
        const { created_at } = edge.properties;
        if (created_at !== undefined) {
          data.edges.push({
            ...edge,
            properties: {
              ...edge.properties,
              created_at: created_at * 1000,
            },
            created_at: created_at * 1000,
          });
        } else {
          data.edges.push(edge);
        }
      });
      return {
        success: false,
        code: result.status,
        data,
      };
    }
    return {
      data: result.data,
      code: 200,
      success: true,
    };
  }
}

export default XlabService;
