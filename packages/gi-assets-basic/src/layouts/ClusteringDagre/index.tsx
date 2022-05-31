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
  desc: '可聚类的有向分层布局',
  icon: 'icon-layout-tree',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
