import localforage from 'localforage';
import { GIComponents } from '@alipay/graphinsight';
import { defaultConfig } from './defaultConfig';

// 组件存入localstorage
export const initMarket = () => {
  const components = GIComponents(defaultConfig);
  let list = [];
  Object.keys(components).forEach(key => {
    list.push(components[key]);
  });
  localforage.setItem('market', list);
  return list;
};

export const getComponents = async () => {
  return (await localforage.getItem('market')) || [];
};
