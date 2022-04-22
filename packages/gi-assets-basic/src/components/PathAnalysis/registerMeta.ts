import { deepClone, GIAC_CONTENT_METAS } from '../const';
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.children.title.default = '路径分析';
metas.GIAC_CONTENT.children.icon.default = 'icon-star';
metas.GIAC_CONTENT.children.containerWidth.default = '300px';

const registerMeta = () => {
  return {
    searchRule: {
      name: '查询规则',
      type: 'select',
      options: [
        {
          value: 'All-Path',
          label: '所有路径',
        },
        {
          value: 'Shortest-Path',
          label: '最短路径',
        },
        {
          value: 'Custom-PathRule',
          label: '自定义规则'
        },
      ],
      default: 'All-Path',
    },
    ...metas,
  };
};

export default registerMeta;
