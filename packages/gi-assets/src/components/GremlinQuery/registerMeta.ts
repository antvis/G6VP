import { deepClone, defaultMeta } from '../const';
const registerMeta = context => {
  const { services } = context;
  const serviceOptions = services.map(c => {
    return {
      value: c.id,
      label: c.id,
    };
  });
  const metas = deepClone(defaultMeta);
  metas.GI_CONTAINER_ITEM.children.title.default = 'Gremlin Query';

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
