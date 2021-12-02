import { deepClone, GIAC_METAS } from '../const';

const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = '导出数据';
metas.GIAC.children.icon.default = 'icon-download';

export default () => {
  return metas;
};
