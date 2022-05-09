import { Components } from '@antv/graphin';
import registerMeta from './registerMeta';
const { MiniMap } = Components;

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'MiniMap',
  name: '小地图',
  desc: '启用后，可在小地图上展示信息',
  icon: 'icon-minimap',
  cover: 'http://xxxx.jpg',
  category: 'system-interaction',
  type: 'AUTO',
};

export default {
  info,
  component: MiniMap,
  registerMeta,
};
