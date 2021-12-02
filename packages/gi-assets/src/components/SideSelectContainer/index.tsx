import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'SideSelectContainer',
  name: '侧边下拉容器 Select',
  category: 'components',
  desc: '侧边下拉容器 Select',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  component: Component,
  registerMeta,
};
