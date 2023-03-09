import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
export const ExecAlgorithm = {
  name: '执行 GraphScope 图算法',
  service: async (params = {}) => {
    const { GRAPHSCOPE_ACCOUNT } = utils.getServerEngineContext();
    const graphName = localStorage.getItem('graphScopeGraphName');

    const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER');

    const response = await request(`${httpServerURL}/graphscope/execAlgorithm`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        ...params,
        graphName,
        graphScopeAccount: GRAPHSCOPE_ACCOUNT,
      },
    });
    return response;
  },
};
