import registerMeta from './registerMeta';
import registerShape from './registerShape';
import registerTransform from './registerTransform';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'SimpleNode',
  category: 'node',
  name: '简单节点',
  desc: '简单节点xxxxxxx',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerShape,
  registerMeta,
  registerTransform,
};
