import { deepClone, GIAC_METAS } from '../const';

const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = 'xxxx';
metas.GIAC.children.icon.default = 'icon-arrowleft';

export default () => {
  return metas;
};
