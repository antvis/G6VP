import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'GraphinForce',
  options: {
    type: 'graphin-force',
    animation: false,
    preset: {
      type: 'concentric',
    },
  },
  name: '力导布局',
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
