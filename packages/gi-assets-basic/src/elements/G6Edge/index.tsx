import registerMeta from './registerMeta';
import registerTransform from './registerTransform';
const registerShape = Graphin => {};

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'G6Edge',
  category: 'edge',
  name: 'G6内置边',
  desc: 'G6Edge，XXXXXXXX',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerShape,
  registerMeta,
  registerTransform,
};
