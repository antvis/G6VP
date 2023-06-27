import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'ClusteringDagre',
  options: {
    type: 'clusteringDagre',
  },
  name: $i18n.get({ id: 'basic.layouts.ClusteringDagre.ClusteringHierarchicalLayout', dm: '聚类分层布局' }),
  category: 'basic',
  type: 'LAYOUT',
  desc: $i18n.get({
    id: 'basic.layouts.ClusteringDagre.ClusteringDirectedHierarchicalLayout',
    dm: '可聚类的有向分层布局',
  }),
  icon: 'icon-layout-tree',
  cover: 'http://xxxx.jpg',
  docs: 'https://www.yuque.com/antv/gi/bpvfi1rtglkhz4wc',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
