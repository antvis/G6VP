import registerMeta from './registerMeta';
import registerShape from './registerShape';
import registerTransform from './registerTransform';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'GraphinNode',
  category: 'node',
  name: '官方节点',
  desc: '官方节点,xxxxxxxxxxxxx',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerShape,
  registerMeta,
  registerTransform,
};
