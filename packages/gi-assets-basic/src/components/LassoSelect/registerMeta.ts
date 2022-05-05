import { extra } from '@alipay/graphinsight';
const { deepClone, GIAC_METAS } = extra;

const metas = deepClone(GIAC_METAS);
metas.GIAC.properties.GIAC.properties.title.default = '拉索圈选';
metas.GIAC.properties.GIAC.properties.icon.default = 'icon-lasso';

export default () => {
  return metas;
};
