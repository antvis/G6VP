import Component from './Component';
import registerMeta from './registerMeta';

const info = {
  id: 'FilterPanel',
  name: '筛选面板',
  desc: '通过属性筛选画布信息，可自定义',
  icon: 'icon-filter',
  cover: 'http://xxxx.jpg',
  category: 'data-analysis',
  type: 'GIAC_CONTENT',
};

export default {
  info,
  component: Component,
  registerMeta,
};
