import $i18n from '../../i18n';
const info = {
  id: 'TemplateQuery',
  name: $i18n.get({ id: 'advance.components.TemplateQuery.info.StatementTemplateQuery', dm: '语句模版查询' }),
  desc: $i18n.get({
    id: 'advance.components.TemplateQuery.info.QueryGraphDataThroughTemplates',
    dm: '通过模版查询图数据',
  }),
  icon: 'icon-query',
  category: 'data-query',
  cover: 'http://xxxx.jpg',
  type: 'GIAC_CONTENT',
  services: ['TemplateListService', 'ExecTemplateQueryService'],
  docs: 'https://www.yuque.com/antv/gi/yz0xsyvg7kcgkt6g',
};

export default info;
