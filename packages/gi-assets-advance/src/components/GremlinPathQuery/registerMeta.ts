import { extra } from '@antv/gi-sdk';
import $i18n from '../../i18n';
const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = $i18n.get({
  id: 'advance.components.GremlinPathQuery.registerMeta.GremlinQueryTemplate',
  dm: 'Gremlin 查询模版',
});
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
      name: $i18n.get({ id: 'advance.components.GremlinPathQuery.registerMeta.DataService', dm: '数据服务' }),
      type: 'select',
      default: '',
      options: serviceOptions,
    },
    ...metas,
  };
};

export default registerMeta;
