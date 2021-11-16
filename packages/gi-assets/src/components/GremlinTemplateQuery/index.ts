import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'GremlinTemplateQuery',
  name: 'Gremlin 模板语句查询面板',
  category: 'components',
  desc: '通过 Gremlin 模板语句快速查询图数据',
  cover: 'http://xxxx.jpg',
  type: 'GI_CONTAINER_INDEX',
};

export default {
  info,
  component: Component,
  registerMeta,
};
