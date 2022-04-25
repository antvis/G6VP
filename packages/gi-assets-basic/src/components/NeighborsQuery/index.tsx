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
      service: (params, localData) => {
        const { id } = params;
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
  ];
};

export default {
  id: ASSET_ID,
  info,
  component: Component,
  registerMeta,
  mockServices,
};
