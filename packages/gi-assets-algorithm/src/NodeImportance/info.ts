import $i18n from '../i18n'; /**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'NodeImportance',
  name: $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.info.NodeImportance', dm: '节点重要性' }),
  category: 'algorithm-analysis',
  type: 'GIAC_CONTENT',
  desc: $i18n.get({
    id: 'gi-assets-algorithm.src.NodeImportance.info.ThroughPagerankDegreeCentralityAttributes',
    dm: '通过 PageRank、度中心性、属性等',
  }),
  cover: 'http://xxxx.jpg',
  icon: 'icon-rules',
  docs: 'https://www.yuque.com/antv/gi/synavummamac5yya',
};
export default info;
