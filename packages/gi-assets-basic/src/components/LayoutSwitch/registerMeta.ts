import { extra } from '@alipay/graphinsight';
import info from './info';
const { deepClone, GIAC_METAS } = extra;
const metas = deepClone(GIAC_METAS);

metas.GIAC.properties.GIAC.properties.title.default = info.name;
metas.GIAC.properties.GIAC.properties.icon.default = info.icon;
metas.GIAC.properties.GIAC.properties.isShowTooltip.default = false;
metas.GIAC.properties.GIAC.properties.tooltip.default = '一键切换画布布局';
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
export default () => {
  return metas;
};
