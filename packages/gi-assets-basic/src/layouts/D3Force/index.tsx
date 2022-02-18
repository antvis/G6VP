import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'D3Force',
  options: {
    type: 'force',
  },
  name: 'D3力导布局',
  category: 'basic',
  type: 'LAYOUT',
  desc: '',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
