import { utils } from '@antv/gi-sdk';
import request from 'umi-request';

export const PropertiesPanel = {
  name: '查询元素属性',
  service: async params => {
    const { id, source, target } = params as any;
    const { httpServerURL, graphId, uri } = utils.getServerEngineContext();

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
