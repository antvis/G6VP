import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'ModeSwitch',
  name: '模式切换',
  desc: '一键切换分析模式，打造沉浸式分析体验',
  icon: 'icon-sidebar',
  cover: 'http://xxxx.jpg',
  category: 'container-components',
  type: 'GICC',
};

export default {
  info,
  component: Component,
  registerMeta,
};
