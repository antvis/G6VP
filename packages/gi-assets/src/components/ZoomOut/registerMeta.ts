import { deepClone, GIAC_METAS } from '../const';

const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = '缩小';
metas.GIAC.children.icon.default = 'icon-zoom-out';

export default () => {
  return metas;
};
