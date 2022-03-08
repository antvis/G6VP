import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'ZoomOut',
  name: '缩小',
  desc: '缩小',
  cover: 'http://xxxx.jpg',
  category: 'canvas-interaction',
  type: 'GIAC',
};

export default {
  info,
  component: Component,
  registerMeta,
};
