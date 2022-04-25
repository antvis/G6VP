import { extra } from '@alipay/graphinsight';
const { deepClone, GI_CONTAINER_METAS } = extra;
const metas = deepClone(GI_CONTAINER_METAS);
const registerMeta = context => {
  const { GI_CONTAINER_INDEXS = [] } = context;
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
