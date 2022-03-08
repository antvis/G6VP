import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'PropertiesPanel',
  name: '属性面板',
  desc: '属性面板',
  cover: 'http://xxxx.jpg',
  category: 'data-analysis',
  type: 'AUTO',
};

export default {
  info,
  component: Component,
  registerMeta,
};
