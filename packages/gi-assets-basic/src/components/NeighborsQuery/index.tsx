import Component from './Component';
import registerMeta from './registerMeta';

const ASSET_ID = 'NeighborsQuery';
const SERVICE_ID = `Mock/${ASSET_ID}`;
const GS_SERVICE_ID = `GraphScope/${ASSET_ID}`;

const info = {
  id: ASSET_ID,
  category: 'data-query',
  type: 'GIAC_MENU',
  name: '邻居查询',
  desc: '集成在右键菜单中，可查询邻居节点',
  icon: 'icon-one-degree',
  cover: 'http://xxxx.jpg',
};
const mockServices = () => {
  return [
    {
      id: SERVICE_ID,
      service: (params, localData) => {
        const { id } = params;
        console.log('邻居查询', params);
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
          return resolve(data);
        });
      },
    },
    {
      id: GS_SERVICE_ID,
      service: (params, localData) => {
        const { id, sep } = params;

        return fetch(`http://dev.alipay.net:7001/graphcompute/gremlinQuery`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            statement: `g.V('${id}').repeat(bothE()).times(${sep})`,
            gremlinServer: localStorage.getItem('graphScopeGremlinServer'),
          }),
        })
          .then(response => response.json())
          .then(res => {
            if (res.success) {
              return res.data;
            }
            return {
              nodes: [],
              edges: [],
            };
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
