import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'LargeGraph',
  name: '3D大图',
  category: 'components',
  desc: '3D大图',
  cover: 'http://xxxx.jpg',
  type: 'GIAC',
};

export default {
  info,
  component: Component,
  registerMeta,
};
