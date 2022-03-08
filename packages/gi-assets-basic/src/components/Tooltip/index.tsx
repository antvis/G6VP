import Component from './NodeTooltip';
import registerMeta from './NodeTooltipMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'Tooltip',
  name: '节点提示框',

  desc: '节点提示框',
  cover: 'http://xxxx.jpg',
  category: 'node-interaction',
  type: 'AUTO',
};

export default {
  info,
  component: Component,
  registerMeta,
};
