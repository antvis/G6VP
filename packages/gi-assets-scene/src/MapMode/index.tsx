import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'MapMode',
  name: '地图模式',
  desc: '将节点的地理坐标映射到地图上',
  icon: 'icon-global',
  cover: 'http://xxxx.jpg',
  category: 'scene-analysis',
  type: 'GIAC',
};

export default {
  info,
  component: Component,
  registerMeta,
};
