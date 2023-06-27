import $i18n from '../../i18n';
const info = {
  id: 'AnalysisHistory',
  name: $i18n.get({ id: 'advance.components.AnalysisHistory.info.AnalyzeHistoricalPrecipitation', dm: '分析历史沉淀' }),
  desc: $i18n.get({
    id: 'advance.components.AnalysisHistory.info.RecordsTheAnalysisHistoryAnd',
    dm: '记录分析历史，并可沉淀为模版',
  }),
  cover: 'http://xxxx.jpg',
  category: 'canvas-interaction',
  type: 'AUTO',
  icon: 'icon-time-circle',
  docs: 'https://yuque.antfin.com/graphinsight/az1phr/gw5nwttkqc4h3ayg',
  services: ['SaveHistoryTemplateService', 'ListHistoryTemplateService', 'RemoveHistoryTemplateService'],
};
export default info;
