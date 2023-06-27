import { PLACEMENT_OPTIONS } from '../const';
import $i18n from '../../i18n';
const registerMeta = () => {
  const schema = {
    imageUrl: {
      title: $i18n.get({ id: 'basic.components.Copyright.registerMeta.CopyrightImage', dm: '版权图片' }),
      type: 'string',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      default: '',
    },
    width: {
      title: $i18n.get({ id: 'basic.components.Copyright.registerMeta.Width', dm: '宽度' }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 100,
    },
    height: {
      title: $i18n.get({ id: 'basic.components.Copyright.registerMeta.Height', dm: '高度' }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 100,
    },
    placement: {
      title: $i18n.get({ id: 'basic.components.Copyright.registerMeta.ComponentLocation', dm: '组件位置' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: PLACEMENT_OPTIONS,
      default: 'RB',
    },
    offset: {
      title: $i18n.get({ id: 'basic.components.Copyright.registerMeta.Offset', dm: '偏移量' }),
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
