import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'AjustLayout',
  name: '布局调整',
  category: 'layout-analysis',
  desc: '布局调整',
  cover: 'http://xxxx.jpg',
  type: 'GIAC_CONTENT',
  docs: 'https://www.yuque.com/antv/gi/kehgv931z5v1fmg8',
};

export default {
  info,
  component: Component,
  registerMeta,
} as any;
