import { utils } from '@antv/gi-sdk';
import { isString } from '@antv/util';
import request from 'umi-request';

export const PropertiesPanel = {
  name: '查询元素属性',
  service: async params => {
    const { id } = params as any;
    const { httpServerURL, graphId, uri } = utils.getServerEngineContext();
    const idArr = isString(id) ? [id] : id;

    try {
      const response = await request(`${httpServerURL}/api/hugegraph/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        data: {
          graphId,
          uri,
          ids: idArr,
        },
      });
      return response;
    } catch (error) {
      return null;
    }
  },
};
