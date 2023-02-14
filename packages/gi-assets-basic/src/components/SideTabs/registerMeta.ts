import { extra } from '@antv/gi-sdk';
const { deepClone, GI_CONTAINER_METAS } = extra;
const metas = deepClone(GI_CONTAINER_METAS);

metas.placement.default = 'LB';
metas.height.default = '400px';
metas.width.default = '400px';

const registerMeta = context => {
  const { GIAC_CONTENT_ITEMS = [] } = context;

  const schema = {
    GI_CONTAINER: {
      title: '集成组件',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      enum: GIAC_CONTENT_ITEMS,
      default: [],
    },
    outSideFromCanvas: {
      title: '独立DOM',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    tabPosition: {
      title: '导航布局',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { label: 'left', value: 'left' },
        { label: 'right', value: 'right' },
        { label: 'top', value: 'top' },
        { label: 'bottom', value: 'bottom' },
      ],
      default: 'left',
    },
    defaultVisible: {
      title: '默认展开',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    ...metas,
  };

  return schema;
};

export default registerMeta;
