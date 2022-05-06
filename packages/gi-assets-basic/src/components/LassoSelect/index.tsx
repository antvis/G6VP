import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'LassoSelect',
  name: '自由圈选',
  desc: '可通过拉索工具，自由圈选画布元素',
  icon: 'icon-lasso',
  cover: 'http://xxxx.jpg',
  category: 'canvas-interaction',
  type: 'GIAC',
};

export default {
  info,
  component: Component,
  registerMeta,
};
