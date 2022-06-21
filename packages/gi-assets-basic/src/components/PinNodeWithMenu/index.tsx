import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'PinNodeWithMenu',
  name: '固定节点(MENU)',
  category: 'elements-interaction',
  desc: '固定节点，常集成在右键菜单中',
  cover: 'http://xxxx.jpg',
  icon: 'icon-pushpin',
  type: 'GIAC_MENU',
};

export default {
  info,
  component: Component,
  registerMeta,
};
