import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'Grid',
  options: {
    type: 'grid',
  },
  name: $i18n.get({ id: 'basic.layouts.Grid.GridLayout', dm: '网格布局' }),
  category: 'basic',
  type: 'LAYOUT',
  desc: $i18n.get({ id: 'basic.layouts.Grid.NodesAreArrangedByGrid', dm: '节点按照网格排布' }),
  icon: 'icon-layout-grid-fill',
  cover: 'http://xxxx.jpg',
  docs: 'https://www.yuque.com/antv/gi/aaoz8n0lmvxxevml',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
