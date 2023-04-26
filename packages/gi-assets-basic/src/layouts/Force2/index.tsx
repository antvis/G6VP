import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'Force2',
  options: {
    type: 'force2',
    animate: false,
    preset: {
      type: 'concentric',
      width: 800,
      height: 800,
      minNodeSpacing: 10,
      nodeSize: 10,
    },
    clusterNodeStrength: 35,
    minMovement: 10,
    damping: 0.8,
    maxSpeed: 1000,
    distanceThresholdMode: 'max',
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
