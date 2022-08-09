import { extra } from '@alipay/graphinsight';
const { deepClone, GI_CONTAINER_METAS } = extra;
const metas = deepClone(GI_CONTAINER_METAS);

metas.height.default = 'calc(100vh - 120px)';
metas.width.default = '450px';
metas.offset.default = [120, 70];
metas.placement.default = 'LT';

const modes = ['TableMode'];

const registerMeta = context => {
  const { GIAC_CONTENT_ITEMS = [] } = context;
  const modeItems = GIAC_CONTENT_ITEMS.filter(item => modes.includes(item.value));

  const schema = {
    GI_CONTAINER: {
      title: '集成组件',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      enum: modeItems,
      default: [],
    },
    ...metas,
  };

  return schema;
};

export default registerMeta;
