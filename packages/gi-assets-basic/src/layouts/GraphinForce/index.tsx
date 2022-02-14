import registerLayout from './registerLayout';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'GraphinForce',
  options: {
    type: 'graphin-force',
  },
  name: 'Graphin力导布局',
  category: 'layout',
  desc: '',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerLayout,
  registerMeta,
};
