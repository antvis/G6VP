import { extra } from '@alipay/graphinsight';
const { deepClone, GI_CONTAINER_METAS } = extra;
const metas = deepClone(GI_CONTAINER_METAS);

metas.height.default = 'calc(100vh - 120px)';
metas.width.default = '450px';
metas.offset.default = [0, 0];
metas.placement.default = 'LT';

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
    ...metas,
  };

  return schema;
};

export default registerMeta;
