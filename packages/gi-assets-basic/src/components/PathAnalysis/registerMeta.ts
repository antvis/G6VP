import { deepClone, GIAC_CONTENT_METAS } from '../const';
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.children.title.default = '路径分析';
metas.GIAC_CONTENT.children.icon.default = 'icon-star';
metas.GIAC_CONTENT.children.containerWidth.default = '300px';

const registerMeta = () => {
  return {
    filterRule: {
      name: '过滤规则',
      type: 'TagsSelect',
      options: ['all-path', 'shortest-path', 'custom-pathRule'],
      default: ['all-path', 'shortest-path', 'custom-pathRule'],
    },
    ...metas,
  };
};

export default registerMeta;
