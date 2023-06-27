import $i18n from '../../i18n';
const ASSET_ID = 'StyleSetting';
const info = {
  id: ASSET_ID,
  name: $i18n.get({ id: 'advance.components.StyleSetting.info.StyleSettings', dm: '样式设置' }),
  desc: $i18n.get({
    id: 'advance.components.StyleSetting.info.SetElementStylesToCustomize',
    dm: '设置元素样式，可自定义分组规则',
  }),
  icon: 'icon-bg-colors',
  cover: 'http://xxxx.jpg',
  category: 'elements-interaction',
  services: [ASSET_ID],
  type: 'GIAC_CONTENT',
  docs: 'https://www.yuque.com/antv/gi/kf54p9k1ffxpcm18',
};
export default info;
