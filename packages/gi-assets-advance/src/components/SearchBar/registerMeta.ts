import { extra } from '@antv/gi-sdk';
import $i18n from '../../i18n';

const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = $i18n.get({
  id: 'advance.components.SearchBar.registerMeta.SearchBar',
  dm: '搜索栏',
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
      name: $i18n.get({ id: 'advance.components.SearchBar.registerMeta.DataService', dm: '数据服务' }),
      type: 'select',
      default: '',
      options: serviceOptions,
    },
    schemaServiceId: {
      name: $i18n.get({ id: 'advance.components.SearchBar.registerMeta.SchemaService', dm: 'Schema服务' }),
      type: 'select',
      default: '',
      options: serviceOptions,
    },
    ...metas,
  };
};

export default registerMeta;
