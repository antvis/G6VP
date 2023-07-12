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
      return {
        success: false,
        code: result.status,
        data: result.data,
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
      return {
        success: false,
        code: result.status,
        data: result.data,
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
