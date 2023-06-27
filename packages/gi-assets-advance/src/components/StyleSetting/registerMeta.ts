import { extra, utils } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';
const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = 'icon-bold';
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = $i18n.get({
  id: 'advance.components.StyleSetting.registerMeta.StyleSettings',
  dm: '样式设置',
});

const registerMeta = context => {
  const { services, engineId } = context;

  const { options, defaultValue } = utils.getServiceOptionsByEngineId(services, info.services[0], engineId);

  return {
    serviceId: {
      title: $i18n.get({ id: 'advance.components.StyleSetting.registerMeta.DataService', dm: '数据服务' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: options,
      },
      default: defaultValue,
    },
    ...metas,
  };
};

/** 默认的配置值 */
export default registerMeta;
