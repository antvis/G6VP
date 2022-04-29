import { extra } from '@alipay/graphinsight';
const { deepClone, GIAC_METAS } = extra;

const metas = deepClone(GIAC_METAS);
metas.GIAC.properties.GIAC.properties.title.default = '导出';
metas.GIAC.properties.GIAC.properties.icon.default = 'icon-export';

export default () => {
  return metas;
};
