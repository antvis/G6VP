import $i18n from '../../i18n';
const modes = ['TableMode', 'MapMode'];

const registerMeta = context => {
  const { GIAC_CONTENT_ITEMS = [], GIAC_ITEMS } = context;
  const modeItems = [...GIAC_CONTENT_ITEMS].filter(item => modes.includes(item.value));

  const schema = {
    GI_CONTAINER: {
      title: $i18n.get({ id: 'advance.components.ModeSwitch.registerMeta.IntegratedComponents', dm: '集成组件' }),
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
      title: $i18n.get({ id: 'advance.components.ModeSwitch.registerMeta.PlacementOrientation', dm: '放置方位' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            value: 'LT',
            label: $i18n.get({ id: 'advance.components.ModeSwitch.registerMeta.TopLeftTop', dm: '左上 / top' }),
          },
          {
            value: 'RT',
            label: $i18n.get({ id: 'advance.components.ModeSwitch.registerMeta.TopRightRight', dm: '右上 / right' }),
          },
          {
            value: 'LB',
            label: $i18n.get({ id: 'advance.components.ModeSwitch.registerMeta.LowerLeftLeft', dm: '左下 / left' }),
          },
          {
            value: 'RB',
            label: $i18n.get({
              id: 'advance.components.ModeSwitch.registerMeta.BottomRightBottom',
              dm: '右下 / bottom',
            }),
          },
        ],
      },
      default: 'LT',
    },
    offset: {
      title: $i18n.get({ id: 'advance.components.ModeSwitch.registerMeta.OffsetDistance', dm: '偏移距离' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Offset',
      default: [16, 8],
    },
  };

  return schema;
};

export default registerMeta;
