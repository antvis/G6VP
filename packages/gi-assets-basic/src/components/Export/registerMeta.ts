import { deepClone, GIAC_METAS } from '../const';

const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = '导出';
metas.GIAC.children.icon.default = 'icon-export';

export default () => {
  return metas;
};
