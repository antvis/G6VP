import { deepClone, GIAC_METAS } from '../const';

const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = '居中';
metas.GIAC.children.icon.default = 'icon-center';

export default () => {
  return metas;
};
