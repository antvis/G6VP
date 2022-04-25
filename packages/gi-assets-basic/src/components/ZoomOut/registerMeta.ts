import { extra } from '@alipay/graphinsight';
const { deepClone, GIAC_METAS } = extra;

const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = '缩小';
metas.GIAC.children.icon.default = 'icon-zoomout';
metas.GIAC.children.isShowTitle.default = false;
metas.GIAC.children.tooltipPlacement.default = 'right';

export default () => {
  return metas;
};
