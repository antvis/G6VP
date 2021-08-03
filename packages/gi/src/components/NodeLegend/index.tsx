import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'NodeLegend',
  name: '节点图例',
  category: 'components',
  desc: '节点图例，xxxxxxxxx',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  component: Component,
  registerMeta,
};
