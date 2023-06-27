import { extra, utils } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';
const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);

metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.tooltip.default = info.desc;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.containerWidth.default = '400px';

export default ({ services }) => {
  const serviceOptions = services.map(c => {
    return {
      value: c.id,
      label: c.id,
    };
  });
  return {
    getThemeServiceId: {
      title: $i18n.get({ id: 'advance.components.ThemeSetting.registerMeta.GetThemeServices', dm: '获取主题服务' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: utils.getServiceOptions(services, 'GetTheme'),
      },
      default: 'GI/GetTheme',
    },
    addThemeServiceId: {
      title: $i18n.get({ id: 'advance.components.ThemeSetting.registerMeta.AddThemeService', dm: '添加主题服务' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: utils.getServiceOptions(services, 'AddTheme'),
      },
      default: 'GI/AddTheme',
    },
    removeThemeServiceId: {
      title: $i18n.get({ id: 'advance.components.ThemeSetting.registerMeta.DeleteAThemeService', dm: '删除主题服务' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: utils.getServiceOptions(services, 'RemoveTheme'),
      },
      default: 'GI/RemoveTheme',
    },
    ...metas,
  };
};
