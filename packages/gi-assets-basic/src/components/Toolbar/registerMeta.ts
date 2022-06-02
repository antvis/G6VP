import { DIRECTION_OPTIONS, PLACEMENT_OPTIONS } from '../const';
const registerMeta = context => {
  const { GIAC_ITEMS = [] } = context;

  const schema = {
    GI_CONTAINER: {
      title: '集成组件',
      type: 'array',
      enum: GIAC_ITEMS,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      default: [],
    },
    direction: {
      title: '展示方向',
      type: 'string',
      'x-decorator': 'FormItem',
      ' x-component': 'Radio.Group',
      enum: DIRECTION_OPTIONS,
      default: 'vertical',
    },
    placement: {
      title: '组件位置',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: PLACEMENT_OPTIONS,
      },
      default: 'LT',
    },
    offset: {
      title: '偏移量',
      type: 'array',
      'x-decorator': 'FormItem',
      'x-component': 'Offset',
      'x-component-props': {
        min: 0,
        max: 400,
      },
      default: [24, 64],
    },
  };

  return schema;
};

export default registerMeta;
