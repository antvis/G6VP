import $i18n from '../../i18n';
const ASSET_ID = 'Assistant';

const info = {
  id: ASSET_ID,
  name: $i18n.get({ id: 'advance.components.Assistant.info.AiAssistant', dm: 'AI 助理' }),
  desc: $i18n.get({ id: 'advance.components.Assistant.info.AiAssistant', dm: 'AI 助理' }),
  cover: 'http://xxx.jpg',
  category: 'system-interaction',
  services: ['CypherQuery', 'GremlinQuery'],
  icon: 'icon-robot',
  type: 'AUTO',
  docs: 'https://www.yuque.com/antv/gi/zepk11ds9vrt4gcs',
};
export default info;
