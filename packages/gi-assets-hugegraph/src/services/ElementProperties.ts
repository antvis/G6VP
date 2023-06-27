import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
import $i18n from '../i18n';

export const PropertiesPanel = {
  name: $i18n.get({ id: 'hugegraph.src.services.ElementProperties.QueryElementAttributes', dm: '查询元素属性' }),
  service: async params => {
    const { id, source, target } = params as any;
    const {
      HTTP_SERVICE_URL: httpServerURL,
      CURRENT_SUBGRAPH: graphId,
      engineServerURL: uri,
    } = utils.getServerEngineContext();

    try {
      const response = await request(`${httpServerURL}/api/hugegraph/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        data: {
          graphId,
          uri,
          id,
          itemType: source && target ? 'edge' : 'node',
        },
      });
      return response.data;
    } catch (error) {
      return null;
    }
  },
};
