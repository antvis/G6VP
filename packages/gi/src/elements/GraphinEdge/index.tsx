import registerMeta from './registerMeta';
import registerTransform from './registerTransform';
const registerShape = Graphin => {
  // graphinEdge 已经在内部注册成功
};

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'GraphinEdge',
  category: 'edge',
  name: '官方内置边',
  desc: 'GraphinEdge，XXXXXXXX',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerShape,
  registerMeta,
  registerTransform,
};
