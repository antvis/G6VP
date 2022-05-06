import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'Loading',
  name: '加载动画',
  desc: '异步加载数据时，可展示加载动画',
  icon: 'icon-loading',
  cover: 'http://xxxx.jpg',
  category: 'system-interaction',
  type: 'AUTO',
};

export default {
  info,
  component: Component,
  registerMeta,
};
