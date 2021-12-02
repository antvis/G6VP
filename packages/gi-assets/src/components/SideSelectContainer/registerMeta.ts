import { deepClone, GI_CONTAINER_METAS } from '../const';
const metas = deepClone(GI_CONTAINER_METAS);

metas.height.default = 'calc(100vh - 120px)';
metas.width.default = '450px';
metas.offset.default = [0, 61];

const registerMeta = context => {
  const { GI_CONTAINER_INDEXS } = context;
  return {
    /** 分类信息 */
    GI_CONTAINER: {
      name: '集成组件',
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
    },
    ...metas,
  };
};

export default registerMeta;
