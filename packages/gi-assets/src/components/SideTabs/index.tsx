import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'SideTabs',
  name: '侧边切换栏',
  category: 'components',
  desc: '侧边切换栏',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  component: Component,
  registerMeta,
};
