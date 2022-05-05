import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'MapMode',
  name: '地图模式',
  desc: '地图模式',
  cover: 'http://xxxx.jpg',
  category: 'scene-analysis',
  type: 'GIAC',
};

export default {
  info,
  component: Component,
  registerMeta,
};
