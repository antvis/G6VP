import { extra } from '@alipay/graphinsight';
const { deepClone, GIAC_CONTENT_METAS } = extra;

const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.children.title.default = '关系扩散';
metas.GIAC_CONTENT.children.icon.default = 'icon-star';

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
    ...metas,
  };
};

export default registerMeta;
