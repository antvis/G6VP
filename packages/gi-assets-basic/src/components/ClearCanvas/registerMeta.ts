import { extra } from '@antv/gi-sdk';
import info from './info';
const { deepClone, GIAC_METAS } = extra;

const metas = deepClone(GIAC_METAS);
metas.GIAC.properties.GIAC.properties.title.default = info.name;
metas.GIAC.properties.GIAC.properties.icon.default = info.icon;
metas.GIAC.properties.GIAC.properties.tooltip.default = info.desc;
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;

export default () => {
  return metas;
};
