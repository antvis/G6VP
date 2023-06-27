import { DIRECTION_OPTIONS, PLACEMENT_OPTIONS } from '../const';
import $i18n from '../../i18n';
const registerMeta = context => {
  const { GIAC_ITEMS = [] } = context;

  const schema = {
    GI_CONTAINER: {
      title: $i18n.get({ id: 'basic.components.Toolbar.registerMeta.IntegratedComponents', dm: '集成组件' }),
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
      title: $i18n.get({ id: 'basic.components.Toolbar.registerMeta.DisplayDirection', dm: '展示方向' }),
      type: 'string',
      'x-decorator': 'FormItem',
      ' x-component': 'Radio.Group',
      enum: DIRECTION_OPTIONS,
      default: 'vertical',
    },
    placement: {
      title: $i18n.get({ id: 'basic.components.Toolbar.registerMeta.ComponentLocation', dm: '组件位置' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: PLACEMENT_OPTIONS,
      },
      default: 'LT',
    },
    offset: {
      title: $i18n.get({ id: 'basic.components.Toolbar.registerMeta.Offset', dm: '偏移量' }),
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
