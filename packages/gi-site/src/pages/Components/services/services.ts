import Lockr from 'lockr';
import { GIComponents } from '@alipay/graphinsight';
import { defaultConfig } from './defaultConfig';

// 组件存入localstorage
export const initMasket = () => {
  const components = GIComponents(defaultConfig);
  let list = [];
  Object.keys(components).forEach(key => {
    list.push(components[key]);
  });
  Lockr.set('market', list);
};

export const getComponets = () => {
  return Lockr.get('market') || [];
};
