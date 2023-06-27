import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';

const info = {
  id: 'EdgeBunding',
  name: $i18n.get({ id: 'advance.components.EdgeBundling.EdgeBinding', dm: '边绑定' }),
  category: 'components',
  desc: $i18n.get({ id: 'advance.components.EdgeBundling.EdgeBinding', dm: '边绑定' }),
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  component: Component,
  registerMeta,
};
