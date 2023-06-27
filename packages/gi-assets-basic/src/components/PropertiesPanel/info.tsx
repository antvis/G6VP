import $i18n from '../../i18n';
const ASSET_ID = 'PropertiesPanel';
const info = {
  id: ASSET_ID,
  name: $i18n.get({ id: 'basic.components.PropertiesPanel.info.PropertiesPanel', dm: '属性面板' }),
  desc: $i18n.get({ id: 'basic.components.PropertiesPanel.info.ClickANodeOrEdge', dm: '点击节点或边，展示其详情信息' }),
  icon: 'icon-reconciliation',
  category: 'elements-interaction',
  cover: 'http://xxxx.jpg',
  type: 'AUTO',
  services: [ASSET_ID],
  docs: 'https://www.yuque.com/antv/gi/iv9m1b0zq76fa1sg',
};
export default info;
