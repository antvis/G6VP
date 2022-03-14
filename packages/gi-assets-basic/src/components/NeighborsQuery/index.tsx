import Component from './Component';
import registerMeta from './registerMeta';

const ASSET_ID = 'NeighborsQuery';
const SERVICE_ID = `Mock/${ASSET_ID}`;

const info = {
  id: ASSET_ID,
  category: 'data-query',
  type: 'GIAC_MENU',
  name: '邻居查询',
  desc: '邻居查询',
  cover: 'http://xxxx.jpg',
};

const mockServices = () => {
  return [
    {
      id: SERVICE_ID,
      service: params => {
        console.log('params', params);
        return new Promise(resolve => {
          const { id } = params;
          return resolve({
            nodes: [
              {
                id,
              },
              {
                id: `node-${id}-1`,
              },
              {
                id: `node-${id}-2`,
              },
              {
                id: `node-${id}-3`,
              },
              {
                id: `node-${id}-4`,
              },
            ],
            edges: [
              {
                source: id,
                target: `node-${id}-1`,
              },
              {
                source: id,
                target: `node-${id}-2`,
              },
              {
                source: id,
                target: `node-${id}-3`,
              },
            ],
          });
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
