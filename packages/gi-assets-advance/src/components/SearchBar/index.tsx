import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'SearchBar',
  name: $i18n.get({ id: 'advance.components.SearchBar.IsoGqlSearchBox', dm: 'ISO-GQL 搜索框' }),
  category: 'data-query',
  desc: $i18n.get({ id: 'advance.components.SearchBar.UseIsoGqlStatementsTo', dm: '通过 ISO-GQL 语句快查询图数据' }),
  cover: 'http://xxxx.jpg',
  type: 'GI_CONTAINER_INDEX',
  icon: 'icon-search',
  docs: 'https://www.yuque.com/antv/gi/lw9mwuermhfk3n74',
};

export default {
  info,
  component: Component,
  registerMeta,
};
