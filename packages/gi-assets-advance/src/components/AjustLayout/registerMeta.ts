import { extra } from '@antv/gi-sdk';

const { GIAC_CONTENT_METAS, deepClone } = extra;

const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = '子图布局';
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = 'icon-branches';

export default () => {
  return metas;
};
