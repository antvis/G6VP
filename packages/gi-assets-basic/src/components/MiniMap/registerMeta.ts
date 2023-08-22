import { PLACEMENT_OPTIONS } from '../const';
import $i18n from '../../i18n';

const registerMeta = () => {
  const schema = {
    placement: {
      title: $i18n.get({ id: 'basic.components.MiniMap.registerMeta.ComponentLocation', dm: '组件位置' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: PLACEMENT_OPTIONS,
      default: 'RB',
    },
    offset: {
      title: $i18n.get({ id: 'basic.components.MiniMap.registerMeta.Offset', dm: '偏移量' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Offset',
      'x-component-props': {
        min: 0,
        max: 400,
      },
      default: [0, 0],
    },
  };

  return schema;
};

export default registerMeta;
