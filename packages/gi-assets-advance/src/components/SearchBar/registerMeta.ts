import { extra } from '@alipay/graphinsight';

const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = '搜索栏';

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
      name: '数据服务',
      type: 'select',
      default: '',
      options: serviceOptions,
    },
    schemaServiceId: {
      name: 'Schema服务',
      type: 'select',
      default: '',
      options: serviceOptions,
    },
    ...metas,
  };
};

export default registerMeta;
