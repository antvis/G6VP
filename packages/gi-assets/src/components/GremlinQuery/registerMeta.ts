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
      default: '',
      options: serviceOptions,
    },
    initValue: {
      name: '初始查询语句',
      type: 'input',
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
    showGutter: {
      name: '是否显示行号',
      type: 'switch',
      default: false,
    },
    ...metas,
  };
};

export default registerMeta;
