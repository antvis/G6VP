import registerMeta from './registerMeta';
import Component from './Slider';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'GraphScope',
  name: '「GraphScope」侧边栏',
  category: 'components',
  desc: '「GraphScope」侧边栏',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  component: Component,
  registerMeta,
};
