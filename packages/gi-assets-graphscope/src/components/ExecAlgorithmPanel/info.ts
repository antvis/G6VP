import $i18n from '../../i18n'; /**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'AlgorithmAnalysis',
  name: $i18n.get({ id: 'graphscope.components.ExecAlgorithmPanel.info.AlgorithmAnalysisPanel', dm: '算法分析面板' }),
  desc: $i18n.get({
    id: 'graphscope.components.ExecAlgorithmPanel.info.CallGraphscopeGraphAlgorithmTo',
    dm: '调用 GraphScope 图算法对数据进行分析',
  }),
  icon: 'icon-query',
  category: 'algorithm-analysis',
  cover: 'http://xxxx.jpg',
  type: 'GIAC_CONTENT',
  services: ['ExecAlgorithm'],
};
export default info;
