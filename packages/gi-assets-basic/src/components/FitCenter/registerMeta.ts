import { deepClone, GIAC_METAS } from '../const';

const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = '居中';
metas.GIAC.children.icon.default = 'icon-fit-center';
metas.GIAC.children.isShowTitle.default = false;
metas.GIAC.children.tooltipPlacement.default = 'right';

export default () => {
  return metas;
};
