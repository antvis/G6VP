import { deepClone, GIAC_CONTENT_METAS } from '../const';
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.children.title.default = '筛选面板';
metas.GIAC_CONTENT.children.icon.default = 'icon-star';
metas.GIAC_CONTENT.children.containerWidth.default= '300px'

const registerMeta = () => {
  return {
    histogramColor: {
      name: '直方图颜色',
      type: 'fill',
      default: '#3056E3'
    },
    isFilterIsolatedNodes: {
      name: "过滤孤立节点",
      type: "switch",
      default: true,
    },
    ...metas
  };
};

export default registerMeta;
