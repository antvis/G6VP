import registerMeta from './registerMeta';
import registerShape from './registerShape';
import registerTransform from './registerTransform';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'SimpleNode',
  category: 'node',
  type: 'NODE',
  name: '官方节点',
  desc: '官方节点',
  cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*myb8SrnSy0cAAAAAAAAAAAAAARQnAQ',
};

export default {
  info,
  registerShape,
  registerMeta,
  registerTransform,
};
