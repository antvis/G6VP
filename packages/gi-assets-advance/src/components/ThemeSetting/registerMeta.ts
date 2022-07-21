import { extra, utils } from '@alipay/graphinsight';
import info from './info';
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
      title: '获取主题服务',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: utils.getServiceOptions(services, 'GetTheme'),
      },
      default: 'GI/GetTheme',
    },
    addThemeServiceId: {
      title: '添加主题服务',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: utils.getServiceOptions(services, 'AddTheme'),
      },
      default: 'GI/AddTheme',
    },
    removeThemeServiceId: {
      title: '删除主题服务',
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
