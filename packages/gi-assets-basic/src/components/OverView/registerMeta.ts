import { extra } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';
const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.containerWidth.default = '400px';

export default () => {
  return {
    limit: {
      title: $i18n.get({
        id: 'basic.components.OverView.registerMeta.LimitTheNumberOfDisplays',
        dm: '限制展示数量（节点）',
      }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 600,
    },
    filterLogic: {
      title: $i18n.get({ id: 'basic.components.OverView.registerMeta.FilteringLogic', dm: '筛选逻辑' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { value: 'and', label: 'and' },
        { value: 'or', label: 'or' },
      ],

      default: 'and',
    },
    ...metas,
  };
};
