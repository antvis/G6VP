import $i18n from '../../i18n';
const ASSET_ID = 'CypherQuery';
const info = {
  id: ASSET_ID,
  name: $i18n.get({ id: 'advance.components.CypherQuery.info.CypherStatementQuery', dm: 'Cypher 语句查询' }),
  category: 'data-query',
  desc: $i18n.get({ id: 'advance.components.CypherQuery.info.DataQueryModule', dm: '数据查询模块' }),
  cover: 'http://xxxx.jpg',
  type: 'GIAC_CONTENT',
  icon: 'icon-query',
  services: [ASSET_ID, 'PublishTemplate'],
  docs: 'https://www.yuque.com/antv/gi/tt351vzs0agex3un',
};
export default info;
