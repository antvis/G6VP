import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'ModeSwitch',
  name: $i18n.get({ id: 'advance.components.ModeSwitch.ModeSwitching', dm: '模式切换' }),
  desc: $i18n.get({
    id: 'advance.components.ModeSwitch.IntegratesMultipleAnalysisModesAnd',
    dm: '集成多个分析模式，支持切换',
  }),
  icon: 'icon-sidebar',
  cover: 'http://xxxx.jpg',
  category: 'container-components',
  type: 'GICC',
  docs: 'https://www.yuque.com/antv/gi/uzzgt9vxx4leche6',
};

export default {
  info,
  component: Component,
  registerMeta,
};
