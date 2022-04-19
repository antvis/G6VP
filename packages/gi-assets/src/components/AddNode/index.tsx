import Component from './Component';
import registerMeta from './registerMeta';

const info = {
  id: 'AddNode',
  name: '添加节点',
  category: 'components',
  desc: '添加节点',
  cover: 'http://xxxx.jpg',
  type: 'GIAC_CONTENT',
};

export default {
  info,
  component: Component,
  registerMeta,
};
