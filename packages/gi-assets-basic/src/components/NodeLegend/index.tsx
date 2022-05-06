import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'NodeLegend',
  name: '节点图例',
  desc: '启用后可展示节点的图例信息',
  icon: 'icon-legend',
  cover: 'http://xxxx.jpg',
  category: 'data-analysis',
  type: 'AUTO',
};

export default {
  info,
  component: Component,
  registerMeta,
};
