import { deepClone, GIAC_METAS } from '../const';

const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = '清空画布';
metas.GIAC.children.icon.default = 'icon-clear';

export default () => {
  return metas;
};
