import registerMeta from './registerMeta';
import registerShape from './registerShape';
import registerTransform from './registerTransform';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'MarkerNode',
  category: 'node',
  name: '图元节点',
  desc: '图元节点xxxxxxxxx',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerMeta,
  registerShape,
  registerTransform,
};
