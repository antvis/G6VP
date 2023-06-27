import { extra } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';
const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.containerWidth.default = '400px';

const registerMeta = ({ GIAC_CONTENT_ITEMS }) => {
  return {
    componentKeys: {
      title: $i18n.get({ id: 'basic.components.ContentContainer.registerMeta.IntegratedComponents', dm: '集成组件' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      enum: GIAC_CONTENT_ITEMS,
      default: [],
    },
    ...metas,
  };
};

export default registerMeta;
