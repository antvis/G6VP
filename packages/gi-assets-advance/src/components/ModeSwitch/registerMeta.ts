const modes = ['TableMode', 'MapMode'];

const registerMeta = context => {
  const { GIAC_CONTENT_ITEMS = [], GIAC_ITEMS } = context;
  const modeItems = [...GIAC_CONTENT_ITEMS].filter(item => modes.includes(item.value));

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
    // ...metas,
    placement: {
      title: '放置方位',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            value: 'LT',
            label: '左上 / top',
          },
          {
            value: 'RT',
            label: '右上 / right',
          },
          {
            value: 'LB',
            label: '左下 / left',
          },
          {
            value: 'RB',
            label: '右下 / bottom',
          },
        ],
      },
      default: 'LT',
    },
    offset: {
      title: '偏移距离',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Offset',
      default: [16, 8],
    },
  };

  return schema;
};

export default registerMeta;
