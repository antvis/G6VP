import $i18n from '../../i18n';
const ASSET_ID = 'GremlinQuery';
const info = {
  id: ASSET_ID,
  name: $i18n.get({ id: 'advance.components.GremlinQuery.info.GremlinQuery', dm: 'Gremlin 查询' }),
  desc: $i18n.get({
    id: 'advance.components.GremlinQuery.info.QueryGraphDataThroughGremlin',
    dm: '通过 Gremlin 语句查询图数据',
  }),
  icon: 'icon-query',
  category: 'data-query',
  cover: 'http://xxxx.jpg',
  type: 'GIAC_CONTENT',
  services: [ASSET_ID, 'PublishTemplate'],
  docs: 'https://www.yuque.com/antv/gi/nfkf0ku3rgvnican',
};
export default info;
