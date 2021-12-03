import { deepClone, GI_CONTAINER_METAS } from '../const';
const metas = deepClone(GI_CONTAINER_METAS);
//@ts-ignore
metas.gap = {
  name: '间隔',
  type: 'text',
  default: '0px',
};
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
    leftContainer: {
      name: '左侧组件',
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
      showInPanel: {
        conditions: [['.GI_CONTAINER', '$ne', []]],
      },
    },
    centerContainer: {
      name: '中间组件',
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
      showInPanel: {
        conditions: [['.GI_CONTAINER', '$ne', []]],
      },
    },
    rightContainer: {
      name: '右侧组件',
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
      showInPanel: {
        conditions: [['.GI_CONTAINER', '$ne', []]],
      },
    },
    ...metas,
  };
};

export default registerMeta;
