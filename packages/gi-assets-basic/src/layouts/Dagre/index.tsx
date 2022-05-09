import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'Dagre',
  options: {
    type: 'dagre',
  },
  name: '有向分层布局',
  category: 'basic',
  type: 'LAYOUT',
  desc: '节点按照边的流向排布',
  icon: 'icon-layout-dagre',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
