import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'SideTabs',
  name: $i18n.get({ id: 'basic.components.SideTabs.Sidebar', dm: '侧边栏' }),
  desc: $i18n.get({
    id: 'basic.components.SideTabs.CanvasSideNavigationBarWhich',
    dm: '画布侧边导航栏，可集成分析组件',
  }),
  icon: 'icon-sidebar',
  cover: 'http://xxxx.jpg',
  category: 'container-components',
  type: 'GICC',
  docs: 'https://www.yuque.com/antv/gi/to65w8',
};

export default {
  info,
  component: Component,
  registerMeta,
};
