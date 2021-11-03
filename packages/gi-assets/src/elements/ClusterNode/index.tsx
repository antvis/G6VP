import registerMeta from './registerMeta';
import registerShape from './registerShape';
import registerTransform from './registerTransform';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'ClusterNode',
  name: '集群节点',
  category: 'node',
  desc: '甜甜圈组件，用于数据有分布的情况',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  registerShape,
  registerMeta,
  registerTransform,
};
