import $i18n from '../i18n';
const info = {
  id: 'NodesSimilarity',
  name: $i18n.get({ id: 'gi-assets-algorithm.src.NodesSimilarity.info.NodeSimilarity', dm: '节点相似性' }),
  category: 'algorithm-analysis',
  type: 'GIAC_CONTENT',
  desc: $i18n.get({
    id: 'gi-assets-algorithm.src.NodesSimilarity.info.CosineSimilarityBetweenNodesAnd',
    dm: '节点到选定种子节点的余弦相似性',
  }),
  cover: 'http://xxxx.jpg',
  icon: 'icon-one-degree',
  docs: 'https://www.yuque.com/antv/gi/kayv86k5gu6dmi7p',
};
export default info;
