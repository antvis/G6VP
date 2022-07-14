import { SERVICE_URL_PREFIX } from './Component';
import info from './info';
const { id: ASSET_ID } = info;
const SERVICE_MOCK_ID = `Mock/${ASSET_ID}`;

const SERVICE_GS_ID = `GraphScope/${ASSET_ID}`;

const mockServices = () => {
  return [
    {
      id: SERVICE_MOCK_ID,
      service: localData => {
        const id = 'mock_gremlin_query';
        const data = {
          nodes: [
            {
              id,
              type: 'user',
            },

            {
              id: `${id}-family`,
              type: 'user',
            },
            {
              id: `${id}-card`,
              type: 'card',
            },
          ],
          edges: [
            {
              source: id,
              target: `${id}-family`,
              type: 'family',
            },
            {
              source: id,
              target: `${id}-card`,
              type: 'own',
            },
          ],
        };
        return new Promise(resolve => {
          return resolve({
            success: true,
            data,
          });
        });
      },
    },
    {
      id: SERVICE_GS_ID,
      service: (params = {}) => {
        // 这里根据不同环境换成相应的地址
        // 测试环境：https://storehouse.test.alipay.net
        // 预发环境：https://graphinsight-pre.alipay.com
        // 生产环境：http://graphinsight-api.antgroup-inc.cn
        return fetch('http://dev.alipay.net:7001/graphcompute/gremlinQuery', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify(params),
        }).then(response => response.json());
      },
    },
  ];
};

export default mockServices;
