import { extra } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';
const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);

metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = $i18n.get({
  id: 'galaxybase.components.DataManage.registerMeta.Data',
  dm: '数据',
});

export default context => {
  return {
    ...metas,
  };
};
