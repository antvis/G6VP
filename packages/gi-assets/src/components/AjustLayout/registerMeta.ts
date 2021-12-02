import { deepClone, defaultMeta } from '../const';
const registerMeta = context => {
  const metas = deepClone(defaultMeta);
  metas.GIAC_CONTENT.children.title.default = '子图布局';
  return metas;
};

export default registerMeta;
