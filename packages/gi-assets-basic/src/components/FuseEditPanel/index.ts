import Component from './Component';
import registerMeta from './registerMeta';
import { ASSET_ID, info } from './info';

const SERVICE_ID = `Mock/${ASSET_ID}`;

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
