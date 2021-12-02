import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'FitView',
  name: '自适应',
  category: 'components',
  desc: '自适应',
  cover: 'http://xxxx.jpg',
  type: 'GI_CONTAINER_INDEX',
};

export default {
  info,
  component: Component,
  registerMeta,
};
