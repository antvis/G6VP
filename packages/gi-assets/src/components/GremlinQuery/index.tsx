import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'GremlinQuery',
  name: 'Gremlin 查询面板',
  category: 'components',
  desc: '通过 Gremlin 语句查询图数据',
  cover: 'http://xxxx.jpg',
  type: 'GI_CONTAINER_INDEX',
};

export default {
  info,
  component: Component,
  registerMeta,
};
