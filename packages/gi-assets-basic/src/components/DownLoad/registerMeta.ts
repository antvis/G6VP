import { extra } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';

const { deepClone, GIAC_METAS } = extra;
const metas = deepClone(GIAC_METAS);
metas.GIAC.properties.GIAC.properties.title.default = info.name;
metas.GIAC.properties.GIAC.properties.icon.default = info.icon;
metas.GIAC.properties.GIAC.properties.tooltip.default = info.desc;
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;

export default () => {
  return {
    mode: {
      title: $i18n.get({ id: 'basic.components.ContextMenu.registerMeta.IntegratedComponents', dm: '模式' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          { label: '全部内容', value: 'full' },
          { label: '视口内容', value: 'viewport' },
        ],
      },
      default: 'full',
    },
    copyright: {
      title: $i18n.get({ id: 'basic.components.Copyright.registerMeta.CopyrightImage', dm: '附加版权图片' }),
      type: 'string',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      default: '',
    },
    ...metas,
  };
};
