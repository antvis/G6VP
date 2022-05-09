import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'StyleSetting',
  name: '样式设置',
  desc: '设置元素样式，可自定义分组规则',
  icon: 'icon-bg-colors',
  cover: 'http://xxxx.jpg',
  category: 'elements-interaction',
  type: 'GIAC_CONTENT',
};

export default {
  info,
  component: Component,
  registerMeta,
};
