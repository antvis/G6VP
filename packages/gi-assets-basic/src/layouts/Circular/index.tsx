import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'Circular',
  options: {
    type: 'circular',
  },
  name: '圆形布局',
  category: 'basic',
  type: 'LAYOUT',
  desc: '圆形布局',
  icon: 'icon-layout-circular',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
