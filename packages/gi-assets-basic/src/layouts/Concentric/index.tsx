import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'Concentric',
  options: {
    type: 'concentric',
  },
  name: $i18n.get({ id: 'basic.layouts.Concentric.ConcentricCircleLayout', dm: '同心圆布局' }),
  category: 'basic',
  type: 'LAYOUT',
  desc: $i18n.get({ id: 'basic.layouts.Concentric.AccordingToTheNodeDegree', dm: '根据节点度数，可按照同心圆排布' }),
  icon: 'icon-layout-concentric',
  cover: 'http://xxxx.jpg',
  docs: 'https://www.yuque.com/antv/gi/gpr0ca0pa26img2x',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
