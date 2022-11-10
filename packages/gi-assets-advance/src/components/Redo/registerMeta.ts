import { extra } from '@antv/gi-sdk';
const { GIAC_METAS, deepClone } = extra;
const metas = deepClone(GIAC_METAS);
metas.GIAC.properties.GIAC.properties.title.default = '重做';
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
metas.GIAC.properties.GIAC.properties.icon.default = 'icon-home';
export default () => {
  return {
    ...metas,
  };
};
