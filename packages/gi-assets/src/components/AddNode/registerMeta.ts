import { deepClone, GIAC_CONTENT_METAS } from '../const';

const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.children.title.default = '添加节点';
metas.GIAC_CONTENT.children.icon.default = 'icon-plus';

export default () => {
  return metas;
};
