import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'Force2',
  options: {
    type: 'force2',
    animation: false,
    preset: {
      type: 'concentric',
    },
  },
  name: '渐进力导(force2)',
  category: 'basic',
  type: 'LAYOUT',
  desc: '渐进式力导布局，可用于动态布局',
  icon: 'icon-layout-force',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
