import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'ClearCanvas',
  name: '清空画布',
  desc: '清空画布上的所有内容',
  cover: 'http://xxxx.jpg',
  category: 'canvas-interaction',
  type: 'GIAC',
  icon: 'icon-clear',
};

export default {
  info,
  component: Component,
  registerMeta,
};
