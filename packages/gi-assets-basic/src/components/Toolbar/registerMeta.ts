import { DIRECTION_OPTIONS, PLACEMENT_OPTIONS } from '../const';
const registerMeta = context => {
  const { GI_CONTAINER_INDEXS = [] } = context;

  const schema = {
    GI_CONTAINER: {
      title: '集成组件',
      type: 'string',
      enum: GI_CONTAINER_INDEXS,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      default:[]
    },
    direction: {
      title: '展示方向',
      type: 'string',
      enum: DIRECTION_OPTIONS,
    },
    placement: {
      title: '组件位置',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: PLACEMENT_OPTIONS,
      default: 'LB',
    },
    offset: {
      title: '偏移量',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Offset',
      'x-component-props': {
        min: 0,
        max: 400,
      },
      default: [100, 20],
    },
  };

  return schema;
};

export default registerMeta;
