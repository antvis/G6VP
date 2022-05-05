import { extra } from '@alipay/graphinsight';
const { deepClone, GI_CONTAINER_METAS } = extra;
const metas = deepClone(GI_CONTAINER_METAS);

// metas.height.default = 'calc(100vh - 120px)';
// metas.width.default = '450px';
// metas.offset.default = [0, 61];
// metas.placement.default = 'LB';

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
    outSideFromCanvas: {
      name: '独立DOM',
      type: 'Switch',
      default: false,
    },
    tabPosition: {
      name: '导航布局',
      type: 'Select',
      default: 'left',
      options: [
        { label: 'left', value: 'left' },
        { label: 'right', value: 'right' },
        { label: 'top', value: 'top' },
        { label: 'bottom', value: 'bottom' },
      ],
    },
    ...metas,
  };
};

export default registerMeta;
