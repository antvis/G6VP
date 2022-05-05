import { extra } from '@alipay/graphinsight';
const { deepClone, GIAC_METAS } = extra;

const metas = deepClone(GIAC_METAS);
metas.GIAC.properties.GIAC.properties.title.default = '居中';
metas.GIAC.properties.GIAC.properties.icon.default = 'icon-fit-center';
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
metas.GIAC.properties.GIAC.properties.tooltipPlacement.default = 'right';

export default () => {
  return metas;
};
