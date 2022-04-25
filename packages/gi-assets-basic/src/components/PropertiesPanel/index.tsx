import Component from './Component';
import registerMeta from './registerMeta';

const ASSET_ID = 'PropertiesPanel';
const SERVICE_ID = `Mock/${ASSET_ID}`;

const info = {
  id: ASSET_ID,
  name: '属性面板',
  desc: '属性面板',
  cover: 'http://xxxx.jpg',
  category: 'data-analysis',
  type: 'AUTO',
};

export interface Parmas {
  [key: string]: any;
}
export interface LocalData {
  nodes: any[];
  edges: any[];
}
const mockServices = () => {
  return [
    {
      id: SERVICE_ID,
      service: (params: Parmas, localData: LocalData) => {
        const { data } = params;
        return new Promise(resolve => {
          return resolve(data);
        });
      },
    },
  ];
};

export default {
  info,
  component: Component,
  registerMeta,
  mockServices,
};
