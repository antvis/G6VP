import { utils } from '@antv/gi-sdk';
import request from 'umi-request';

export const PropertiesPanel = {
  name: '查询元素属性',
  service: async params => {
    const id = params.id;
    const { GRAPHSCOPE_ACCOUNT } = utils.getServerEngineContext();
    const gremlinServer = localStorage.getItem('graphScopeGremlinServer');
    const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER');
    console.log('gsproperty', GRAPHSCOPE_ACCOUNT);

    const response = await request(`${httpServerURL}/graphscope/properties`, {
      method: 'post',
      data: {
        id: [id],
        gremlinServer,
        graphScopeAccount: GRAPHSCOPE_ACCOUNT,
      },
    });

    return response;
  },
};
