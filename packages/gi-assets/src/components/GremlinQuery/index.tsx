import Component from './Component';
import registerMeta from './registerMeta';

const ASSET_ID = 'GremlinQuery';
const SERVICE_MOCK_ID = `Mock/${ASSET_ID}`;
const SERVICE_GS_ID = `GraphScope/${ASSET_ID}`;

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'GremlinQuery',
  name: 'Gremlin 查询面板',
  category: 'components',
  desc: '通过 Gremlin 语句查询图数据',
  cover: 'http://xxxx.jpg',
  type: 'GI_CONTAINER_INDEX',
};

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
            },
            {
              id: `${id}-1`,
            },
            {
              id: `${id}-2`,
            },
            {
              id: `${id}-3`,
            },
            {
              id: `${id}-4`,
            },
          ],
          edges: [
            {
              source: id,
              target: `${id}-1`,
            },
            {
              source: id,
              target: `${id}-2`,
            },
            {
              source: id,
              target: `${id}-3`,
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
        const { value = 'g.V().limit(5)' } = params as any;
        return fetch(`http://dev.alipay.net:7001/graphcompute/gremlinQuery`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            statement: value,
            gremlinServer: localStorage.getItem('graphScopeGremlinServer'),
          }),
        });
      },
    },
  ];
};

export default {
  id: ASSET_ID,
  info,
  component: Component,
  registerMeta,
  mockServices,
};
