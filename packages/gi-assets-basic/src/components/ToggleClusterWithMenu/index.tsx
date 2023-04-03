import Component from './Component';
import registerMeta from './registerMeta';

const info = {
  id: 'ToggleClusterWithMenu',
  name: '展开/收起',
  desc: '集成在右键菜单中，展开/收起节点',
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
} as any;
