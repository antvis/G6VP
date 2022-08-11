import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'AjustLayout',
  name: '布局调整面板',
  category: 'canvas-interaction',
  desc: '布局调整面板',
  cover: 'http://xxxx.jpg',
  type: 'GIAC_CONTENT',
};

export default {
  info,
  component: Component,
  registerMeta,
};
