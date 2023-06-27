import $i18n from '../../i18n';
const info = {
  id: 'GalaxybaseDataSource',
  name: $i18n.get({ id: 'galaxybase.components.DataManage.info.DataManagement', dm: '数据管理' }),
  category: 'engine-manage', //新增的引擎管理模块
  desc: $i18n.get({
    id: 'galaxybase.components.DataManage.info.DataManagementModuleForGs',
    dm: '数据管理模块，用于GS引擎',
  }),
  cover: 'http://xxxx.jpg',
  type: 'GIAC_CONTENT',
  icon: 'icon-database',
};
export default info;
