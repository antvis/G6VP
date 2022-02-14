import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'Random',
  /** 该布局资产下的布局的参数 */
  options: {
    type: 'custom-random',
  },
  name: '随机布局',
  category: 'layout',
  desc: '',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerMeta,
  registerLayout,
};
