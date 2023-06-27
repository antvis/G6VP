import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';

const info = {
  id: 'PinNodeWithMenu',
  name: $i18n.get({ id: 'basic.components.PinNodeWithMenu.FixedNodeMenu', dm: '固定节点(MENU)' }),
  category: 'elements-interaction',
  desc: $i18n.get({
    id: 'basic.components.PinNodeWithMenu.FixedNodeOftenIntegratedIn',
    dm: '固定节点，常集成在右键菜单中',
  }),
  cover: 'http://xxxx.jpg',
  icon: 'icon-pushpin',
  type: 'GIAC_MENU',
  docs: 'https://www.yuque.com/antv/gi/qpuxagq0v56gng23',
};

export default {
  info,
  component: Component,
  registerMeta,
};
