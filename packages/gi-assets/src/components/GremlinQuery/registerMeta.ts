import { extra } from '@alipay/graphinsight';

const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.name = 'Gremlin Query';
metas.GIAC_CONTENT.children.icon.default = 'icon-bold';
metas.GIAC_CONTENT.children.title.default = 'Gremlin Query';

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
      default: 'Mock/GremlinQuery',
      options: serviceOptions,
    },
    initialValue: {
      name: '初始查询语句',
      type: 'text',
      default: 'g.V(1)',
    },
    height: {
      name: '高度',
      default: 200,
      type: 'stepper',
      step: 1,
      min: 0,
      max: 750,
    },
    ...metas,
  };
};

export default registerMeta;
