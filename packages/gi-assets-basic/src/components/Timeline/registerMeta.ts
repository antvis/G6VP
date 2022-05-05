import { extra } from '@alipay/graphinsight';
const  { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = '时序分析';
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = 'icon-Field-time';

export default () => {
  return metas;
};
