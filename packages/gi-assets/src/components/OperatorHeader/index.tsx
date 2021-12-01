import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'OperatorHeader',
  name: '操作头栏',
  category: 'components',
  type: 'GI_CONTAINER', //申明类型为容器组件。
  desc: '操作头栏',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  component: Component,
  registerMeta,
};
