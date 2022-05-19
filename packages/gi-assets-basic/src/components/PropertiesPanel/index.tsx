import Component from './Component';
import registerMeta from './registerMeta';

const ASSET_ID = 'PropertiesPanel';
const SERVICE_ID = `Mock/${ASSET_ID}`;

const info = {
  id: ASSET_ID,
  name: '属性面板',
  desc: '点击节点或边，展示其详情信息',
  icon: 'icon-reconciliation',
  category: 'elements-interaction',
  cover: 'http://xxxx.jpg',
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
