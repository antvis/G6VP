import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'ClusteringDagre',
  options: {
    type: 'clusteringDagre',
  },
  name: '聚类分层布局',
  category: 'basic',
  type: 'LAYOUT',
  desc: '在 Dagre 布局的基础上，增加聚类效果，支持配置每层展示的数量',
  icon: 'icon-layout-circular',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
