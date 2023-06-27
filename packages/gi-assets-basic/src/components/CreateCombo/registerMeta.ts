import { extra } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';
const { deepClone, GIAC_METAS } = extra;
const metas = deepClone(GIAC_METAS);

metas.GIAC.properties.GIAC.properties.title.default = info.name;
metas.GIAC.properties.GIAC.properties.icon.default = info.icon;
metas.GIAC.properties.GIAC.properties.tooltip.default = $i18n.get({
  id: 'basic.components.CreateCombo.registerMeta.CreateCombo',
  dm: '创建Combo',
});
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
export default () => {
  return metas;
};
