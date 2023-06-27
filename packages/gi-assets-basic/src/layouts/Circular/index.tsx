import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'Circular',
  options: {
    type: 'circular',
  },
  name: $i18n.get({ id: 'basic.layouts.Circular.CircularLayout', dm: '圆形布局' }),
  category: 'basic',
  type: 'LAYOUT',
  desc: $i18n.get({ id: 'basic.layouts.Circular.CircularLayout', dm: '圆形布局' }),
  icon: 'icon-layout-circular',
  cover: 'http://xxxx.jpg',
  docs: 'https://www.yuque.com/antv/gi/tervm8tc2nf2z3ok',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
