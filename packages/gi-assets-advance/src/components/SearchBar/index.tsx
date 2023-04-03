import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'SearchBar',
  name: 'ISO-GQL 搜索框',
  category: 'data-query',
  desc: '通过 ISO-GQL 语句快查询图数据',
  cover: 'http://xxxx.jpg',
  type: 'GI_CONTAINER_INDEX',
  icon: 'icon-search',
  docs: 'https://www.yuque.com/antv/gi/lw9mwuermhfk3n74',
};

export default {
  info,
  component: Component,
  registerMeta,
} as any;
