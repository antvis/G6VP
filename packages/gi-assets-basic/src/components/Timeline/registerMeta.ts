import { deepClone, GIAC_CONTENT_METAS } from '../const';

const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.children.title.default = '时序分析';
metas.GIAC_CONTENT.children.icon.default = 'icon-Field-time';

export default () => {
  return metas;
};
