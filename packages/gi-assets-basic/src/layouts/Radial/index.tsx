import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'Radial',
  options: {
    type: 'radial',
  },
  name: $i18n.get({ id: 'basic.layouts.Radial.RadialLayout', dm: '径向布局' }),
  category: 'basic',
  type: 'LAYOUT',
  desc: $i18n.get({ id: 'basic.layouts.Radial.RadiationLayout', dm: '辐射布局' }),
  icon: 'icon-layout-radial',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
