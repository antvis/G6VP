import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'OperatorHeader',
  name: '操作头栏',
  desc: '操作头栏',
  cover: 'http://xxxx.jpg',
  category: 'container-components',
  type: 'GICC',
};

export default {
  info,
  component: Component,
  registerMeta,
} as any;
