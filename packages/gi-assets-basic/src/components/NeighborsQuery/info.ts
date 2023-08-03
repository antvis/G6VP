import $i18n from '../../i18n';
const ASSET_ID = 'NeighborsQuery';

const info = {
  id: ASSET_ID,
  category: 'data-query',
  type: 'GIAC_MENU',
  name: $i18n.get({ id: 'basic.components.NeighborsQuery.info.NeighborQuery', dm: '邻居查询' }),
  desc: $i18n.get({
    id: 'basic.components.NeighborsQuery.info.IntegratedInTheRightClick',
    dm: '集成在右键菜单中，可查询邻居节点',
  }),
  icon: 'icon-kinship',
  cover: 'http://xxxx.jpg',
  services: [ASSET_ID, `${ASSET_ID}Menu`],
  docs: 'https://www.yuque.com/antv/gi/oqw3qkdworuvhp22',
};
export default info;
