import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'FitCenter',
  name: '视图居中',
  desc: '视图居中',
  cover: 'http://xxxx.jpg',
  category: 'canvas-interaction',
  type: 'GIAC',
};

export default {
  info,
  component: Component,
  registerMeta,
};
