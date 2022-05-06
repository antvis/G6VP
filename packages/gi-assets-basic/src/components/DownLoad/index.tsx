import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'DownLoad',
  name: '下载',
  desc: '点击下载画布图片',
  icon: 'icon-download',
  cover: 'http://xxxx.jpg',
  category: 'canvas-interaction',
  type: 'GIAC',
};

export default {
  info,
  component: Component,
  registerMeta,
};
