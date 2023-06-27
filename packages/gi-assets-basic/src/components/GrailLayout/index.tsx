import Component from './Component';
import './index.less';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'GrailLayout',
  name: $i18n.get({ id: 'basic.components.GrailLayout.HolyGrailLayout', dm: '圣杯布局' }),
  desc: $i18n.get({
    id: 'basic.components.GrailLayout.SupportsAssetLayoutInThe',
    dm: '支持左、右、下三个方向资产布局',
  }),
  icon: 'icon-layout',
  cover: 'http://xxxx.jpg',
  category: 'container-components',
  type: 'GICC_LAYOUT',
  docs: 'https://www.yuque.com/antv/gi/nn4q8z3wc8b844gm',
};

export default {
  info,
  component: Component,
  registerMeta,
};
