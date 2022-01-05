import { MiniMap } from '@antv/graphin-components';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'MiniMap',
  name: '小地图',
  category: 'components',
  desc: '小地图小地图',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  component: MiniMap,
  registerMeta,
};
