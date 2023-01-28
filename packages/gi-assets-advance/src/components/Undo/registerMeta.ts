import { extra } from '@antv/gi-sdk';
import info from './info';
const { GIAC_METAS, deepClone } = extra;
const metas = deepClone(GIAC_METAS);
metas.GIAC.properties.GIAC.properties.title.default = info.name;
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
metas.GIAC.properties.GIAC.properties.icon.default = info.icon;
export default () => {
  return {
    ...metas,
  };
};
