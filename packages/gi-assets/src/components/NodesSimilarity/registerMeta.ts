import { deepClone, GIAC_CONTENT_METAS } from '../const';

const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.children.title.default = '节点相似性';
metas.GIAC_CONTENT.children.icon.default = 'icon-home';

export default () => {
  return metas;
};
