import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'ClearCanvas',
  name: '清空画布',
  category: 'components',
  desc: '清空画布',
  cover: 'http://xxxx.jpg',
  type: 'GIAC',
};

export default {
  info,
  component: Component,
  registerMeta,
};
