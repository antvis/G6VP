import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'SideTabs',
  name: '侧边栏',
  desc: '画布侧边导航栏，可集成分析组件',
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
} as any;
