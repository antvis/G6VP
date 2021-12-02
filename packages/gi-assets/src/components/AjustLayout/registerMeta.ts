import { deepClone, GIAC_CONTENT_METAS } from '../const';

const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.children.title.default = '子图布局';
metas.GIAC_CONTENT.children.icon.default = 'icon-branches';

export default () => {
  return metas;
};
