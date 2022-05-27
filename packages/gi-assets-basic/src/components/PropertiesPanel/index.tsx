import Component from './Component';
import registerMeta from './registerMeta';
import mockServices from './MockService';

const info = {
  id: 'PropertiesPanel',
  name: '属性面板',
  desc: '点击节点或边，展示其详情信息',
  icon: 'icon-reconciliation',
  category: 'elements-interaction',
  cover: 'http://xxxx.jpg',
  type: 'AUTO',
};

export default {
  info,
  component: Component,
  registerMeta,
  mockServices,
};
