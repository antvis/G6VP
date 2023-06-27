import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'Random',
  /** 该布局资产下的布局的参数 */
  options: {
    type: 'custom-random',
  },
  name: $i18n.get({ id: 'basic.layouts.Random.RandomLayout', dm: '随机布局' }),
  category: 'custom',
  type: 'LAYOUT',
  desc: '',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerMeta,
  registerLayout,
};
