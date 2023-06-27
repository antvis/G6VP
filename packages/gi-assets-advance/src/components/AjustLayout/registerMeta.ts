import { extra } from '@antv/gi-sdk';
import $i18n from '../../i18n';

const { GIAC_CONTENT_METAS, deepClone } = extra;

const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = $i18n.get({
  id: 'advance.components.AjustLayout.registerMeta.SubgraphLayout',
  dm: '子图布局',
});
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = 'icon-branches';

export default () => {
  return metas;
};
