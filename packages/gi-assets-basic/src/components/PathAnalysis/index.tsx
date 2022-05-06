import Component from './Component';
import registerMeta from './registerMeta';

const info = {
  id: 'PathAnalysis',
  name: '路径分析',
  desc: '选择起点和终点，即可分析路径',
  icon: 'icon-path-analysis',
  cover: 'http://xxxx.jpg',
  category: 'data-analysis',
  type: 'GIAC_CONTENT',
};

export default {
  info,
  component: Component,
  registerMeta,
};
