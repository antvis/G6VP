import { extra } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';
const { deepClone, GIAC_METAS } = extra;
const metas = deepClone(GIAC_METAS);

metas.GIAC.properties.GIAC.properties.title.default = info.name;
metas.GIAC.properties.GIAC.properties.icon.default = info.icon;
metas.GIAC.properties.GIAC.properties.isShowTooltip.default = false;
metas.GIAC.properties.GIAC.properties.tooltip.default = $i18n.get({
  id: 'basic.components.LayoutSwitch.registerMeta.SwitchCanvasLayoutWithOne',
  dm: '一键切换画布布局',
});
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
export default () => {
  return metas;
};
