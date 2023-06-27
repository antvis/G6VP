import $i18n from '../../i18n';
const ASSET_ID = 'Save';
const info = {
  id: 'Save',
  name: $i18n.get({ id: 'basic.components.Save.info.SaveShare', dm: '保存分享' }),
  desc: $i18n.get({ id: 'basic.components.Save.info.SaveTheCanvasAndShare', dm: '保存画布,并分享给其他人' }),
  icon: 'icon-save',
  cover: 'http://xxxx.jpg',
  category: 'workbook',
  type: 'GIAC_CONTENT',
  services: [ASSET_ID],
  docs: 'https://www.yuque.com/antv/gi/kaz51vpwg3oa0i0b',
};
export default info;
