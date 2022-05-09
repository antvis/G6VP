import { extra } from '@alipay/graphinsight';
import info from './info';
const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;

const registerMeta = context => {
  const { services } = context;
  const serviceOptions = services.map(c => {
    return {
      value: c.id,
      label: c.id,
    };
  });

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
      default: 'Mock/GremlinQuery',
    },
    initialValue: {
      title: '初始查询',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      default: 'g.V(1)',
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
