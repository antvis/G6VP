import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'Undo',
  name: '撤销',

  desc: '上一步/下一步',
  cover: '撤销',
  category: 'canvas-interaction',
  type: 'GIAC',
};

export default {
  info,
  component: Component,
  registerMeta,
};
