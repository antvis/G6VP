import registerMeta from './registerMeta';
import registerShape from './registerShape';
import registerTransform from './registerTransform';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'ReasonNode',
  category: 'node',
  name: '草莓图',
  desc: '复合节点，包含玫瑰图、柱状图、节点等，原来用在归因树',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerShape,
  registerMeta,
  registerTransform,
};
