import registerMeta from './registerMeta';
import registerShape from './registerShape';
import registerTransform from './registerTransform';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'RectNode',
  category: 'node',
  name: '方形节点',
  desc: '方形节点xxxxxxxxx',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerMeta,
  registerShape,
  registerTransform,
};
