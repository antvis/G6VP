import { deepClone, GIAC_METAS } from '../const';

const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = '添加节点';
metas.GIAC.children.icon.default = 'icon-plus';

export default () => {
  return metas;
};
