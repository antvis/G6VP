import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
import $i18n from '../i18n';
export const ExecAlgorithm = {
  name: $i18n.get({
    id: 'graphscope.src.services.ExecAlgorithm.ExecuteGraphscopeGraphAlgorithm',
    dm: '执行 GraphScope 图算法',
  }),
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
