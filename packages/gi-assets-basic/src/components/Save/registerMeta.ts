import { extra, utils } from '@alipay/graphinsight';
import info from './info';

const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);

metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.tooltip.default = info.desc;

export default ({ services }) => {
  const serviceOptions = utils.getServiceOptions(services, info.services[0]);
  return {
    serviceId: {
      title: '保存服务',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: serviceOptions,
      },
      default: serviceOptions[0].value,
    },
    ...metas,
  };
};
