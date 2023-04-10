import { extra } from '@antv/gi-sdk';
const { deepClone, GI_CONTAINER_METAS } = extra;
const metas = deepClone(GI_CONTAINER_METAS);

metas.height.default = 'fit-content';
metas.width.default = '100%';
metas.offset.default = [0, 0];
metas.placement.default = 'LT';

const registerMeta = context => {
  const { GIAC_CONTENT_ITEMS = [], GIAC_ITEMS = [] } = context;
  const GIAC_TRANS = GIAC_ITEMS.map(c => {
    return {
      ...c,
      label: c.label + ' (建议集成在工具栏) ',
    };
  });

  return {
    /** 分类信息 */
    GI_CONTAINER: {
      title: '集成组件',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      enum: [...GIAC_CONTENT_ITEMS, ...GIAC_TRANS],
      default: [],
    },
    ...metas,
  };
};

export default registerMeta;
