import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'Force2',
  options: {
    type: 'force',
    animated: false,
    presetLayout: {
      type: 'concentric',
      width: 800,
      height: 800,
      minNodeSpacing: 10,
      nodeSize: 10,
    },
    clusterNodeStrength: 35,
    linkDistance: 200,
    edgeStrength: 1000,
    minMovement: 1,
    damping: 0.9,
    maxSpeed: 1500,
    distanceThresholdMode: 'max',
  },
  name: $i18n.get({ id: 'basic.layouts.Force2.FastForceGuide', dm: '快速力导' }),
  category: 'basic',
  type: 'LAYOUT',
  desc: $i18n.get({
    id: 'basic.layouts.Force2.ProgressiveForceDirectedLayoutFor',
    dm: '渐进式力导布局，可用于动态布局',
  }),
  icon: 'icon-layout-force',
  cover: 'http://xxxx.jpg',
  docs: 'https://www.yuque.com/antv/gi/rloo8d2l7qbsuyg8',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
