import { deepClone, GIAC_METAS } from '../const';

const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = '拉索圈选';
metas.GIAC.children.icon.default = 'icon-lasso';

export default () => {
  return metas;
};
