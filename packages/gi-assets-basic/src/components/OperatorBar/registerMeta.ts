import { extra } from '@alipay/graphinsight';
const { deepClone, GI_CONTAINER_METAS } = extra;
const metas = deepClone(GI_CONTAINER_METAS);
const registerMeta = context => {
  const { GI_CONTAINER_INDEXS = [] } = context;
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
      enum: GI_CONTAINER_INDEXS,
      default: [],
    },
    ...metas,
  };
};

export default registerMeta;
