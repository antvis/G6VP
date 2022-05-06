import Component from './Component';
import registerMeta from './registerMeta';

const info = {
  id: 'SnapshotGallery',
  name: '快照画廊',
  desc: '通过快照，将分析过程保存到画廊',
  icon: 'icon-snapshot',
  cover: 'http://xxx.jpg',
  category: 'system-interaction',
  type: 'GIAC',
};

export default { info, component: Component, registerMeta };
