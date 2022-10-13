import { extra, utils } from '@alipay/graphinsight';
import info from './info';
const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = '语句模版';

const registerMeta = context => {
  const { services, engineId } = context;

  const { options, defaultValue } = utils.getServiceOptionsByEngineId(services, info.services[0], engineId);
  const { options: list, defaultValue: templateDefaultValue } = utils.getServiceOptionsByEngineId(
    services,
    info.services[1],
    engineId,
  );

  return {
    /** 分类信息 */
    templateListServiceId: {
      title: '模板列表服务',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: options,
      },
      default: defaultValue,
    },
    execTemplateServiceId: {
      title: '执行查询服务',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: list,
      },
      default: templateDefaultValue,
    },
    ...metas,
  };
};

export default registerMeta;
