import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'Tooltip',
  name: '节点提示框',
  desc: 'Hover 节点，展示其详细信息',
  cover: 'http://xxxx.jpg',
  category: 'element-interaction',
  icon: 'icon-tooltip',
  type: 'AUTO',
};

export default {
  info,
  component: Component,
  registerMeta,
};
