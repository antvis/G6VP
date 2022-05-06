import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'Placeholder',
  name: '画布占位符',
  desc: '当画布初始化，数据为空时出现的图片占位符',
  icon: 'icon-placeholder',
  cover: 'http://xxxx.jpg',
  category: 'system-interaction',
  type: 'AUTO',
};

export default {
  info,
  component: Component,
  registerMeta,
};
