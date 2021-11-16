import { Meta } from '../WrapContainer';
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
    ...Meta,
  };
};

export default registerMeta;
