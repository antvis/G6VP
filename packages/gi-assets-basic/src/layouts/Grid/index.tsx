import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'Grid',
  options: {
    type: 'grid',
  },
  name: '网格布局',
  category: 'basic',
  type: 'LAYOUT',
  desc: '节点按照网格排布',
  icon: 'icon-layout-grid-fill',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
