import { extra, utils } from '@alipay/graphinsight';
import info from './info';
const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;

const registerMeta = context => {
  const { services } = context;
  const serviceOptions = utils.getServiceOptions(services, info.services[0]);
  console.log("context:", context, serviceOptions)

  return {
    /** 分类信息 */
    serviceId: {
      title: '数据服务',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: serviceOptions,
      },
      default: serviceOptions[0].value,
    },
    initialValue: {
      title: '初始查询',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      default: 'g.V().hasLabel("Film").has("id","c54e6f7dd4dacc1ac5b0fa66565a4a60")',
    },
    height: {
      title: '高度',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 200,
    },
    ...metas,
  };
};

export default registerMeta;
