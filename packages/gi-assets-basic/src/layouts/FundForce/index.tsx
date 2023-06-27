import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'FundForce',
  options: {
    type: 'graphin-force',
    animation: true,
    preset: {
      type: 'concentric',
    },
  },
  name: $i18n.get({ id: 'basic.layouts.FundForce.FinancialGuidance', dm: '资金力导' }),
  category: 'basic',
  type: 'LAYOUT',
  desc: $i18n.get({
    id: 'basic.layouts.FundForce.VerticalForceGuideLayoutBased',
    dm: '基于节点字段大小的垂直力导布局',
  }),
  icon: 'icon-layout-force',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
