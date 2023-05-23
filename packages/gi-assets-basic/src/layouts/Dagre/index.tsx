import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'Dagre',
  options: {
    type: 'dagre',
  },
  name: '有向分层',
  category: 'basic',
  type: 'LAYOUT',
  desc: '节点按照边的流向排布',
  icon: 'icon-layout-tree',
  cover: 'http://xxxx.jpg',
  docs: 'https://www.yuque.com/antv/gi/xcbi5pnxw76to86c',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
