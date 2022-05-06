import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'Concentric',
  options: {
    type: 'concentric',
  },
  name: '同心圆布局',
  category: 'basic',
  type: 'LAYOUT',
  desc: '根据节点度数，可按照同心圆排布',
  icon: 'icon-layout-concentric',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
