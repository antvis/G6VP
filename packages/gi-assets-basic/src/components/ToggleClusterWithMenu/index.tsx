import Component from './Component';
import registerMeta from './registerMeta';
import $i18n from '../../i18n';

const info = {
  id: 'ToggleClusterWithMenu',
  name: $i18n.get({ id: 'basic.components.ToggleClusterWithMenu.ExpandFoldUp', dm: '展开/收起' }),
  desc: $i18n.get({
    id: 'basic.components.ToggleClusterWithMenu.IntegrateInTheRightClick',
    dm: '集成在右键菜单中，展开/收起节点',
  }),
  icon: 'icon-toggle',
  cover: 'http://xxx.jpg',
  category: 'elements-interaction',
  type: 'GIAC_MENU',
  docs: 'https://www.yuque.com/antv/gi/wdg1kfpf0y7f77q3',
};

export default {
  info,
  component: Component,
  registerMeta,
};
