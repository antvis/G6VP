import { deepClone, GIAC_METAS } from '../const';

const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = '放大';
metas.GIAC.children.icon.default = 'icon-zoom-in';

export default () => {
  return metas;
};
