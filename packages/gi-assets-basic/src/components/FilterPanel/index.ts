import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'FilterPanel',
  name: '筛选面板',
  category: 'data-analysis',
  type: 'GIAC_CONTENT',
  desc: '筛选面板',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  component: Component,
  registerMeta,
};
