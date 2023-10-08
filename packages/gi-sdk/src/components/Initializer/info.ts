import $i18n from '../../i18n';
const info = {
  id: 'Initializer',
  name: $i18n.get({ id: 'basic.components.Initializer.info.Initializer', dm: '初始化器' }),
  desc: $i18n.get({
    id: 'basic.components.Initializer.info.RequiredInitializeQueryGraphData',
    dm: '必选！初始化查询图数据与图模型',
  }),
  // icon: 'icon-export',
  cover: 'http://xxxx.jpg',
  category: 'system-interaction',
  type: 'INITIALIZER',
  // 申明需要实现的服务名
  services: ['GI_SERVICE_INTIAL_GRAPH', 'GI_SERVICE_SCHEMA'],
  docs: 'https://www.yuque.com/antv/gi/eedyuy',
};
export default info;
