import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'LargeGraph',
  name: '3D大图',
  category: 'scene-analysis',
  desc: '启用3D视图，可右键节点交互',
  icon: 'icon-3d',
  cover: 'http://xxxx.jpg',
  type: 'GIAC',
};

export default {
  info,
  component: Component,
  registerMeta,
};
