import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'Timeline',
  name: '时序分析',
  desc: '时序分析',
  cover: 'http://xxxx.jpg',
  category: 'data-analysis',
  type: 'GIAC_CONTENT',
};

export default {
  info,
  component: Component,
  registerMeta,
};
