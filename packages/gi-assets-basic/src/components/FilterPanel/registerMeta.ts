import { deepClone, GIAC_CONTENT_METAS } from '../const';
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.children.title.default = '筛选面板';
metas.GIAC_CONTENT.children.icon.default = 'icon-star';
metas.GIAC_CONTENT.children.containerWidth.default= '300px'

const registerMeta = () => {
  return {
    ...metas
  };
};

export default registerMeta;
