import { PLACEMENT_OPTIONS } from '../const';
const registerMeta = context => {
  const { data, schemaData } = context;
  let keys = ['id'];
  try {
    keys = Object.keys(data.nodes[0]?.data || {});
  } catch (error) {
    console.warn(error);
  }

  const options = keys.map(c => {
    return {
      value: c,
      label: c,
    };
  });

  const schema = {
    sortKey: {
      title: '映射字段',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      default: 'type',
      enum: options,
    },
    textColor: {
      title: '字体颜色',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'ColorInput',
      default: '#ddd',
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
