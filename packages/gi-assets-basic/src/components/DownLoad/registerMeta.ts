import { extra } from '@alipay/graphinsight';
const { deepClone, GIAC_METAS } = extra;

const metas = deepClone(GIAC_METAS);
metas.GIAC.properties.GIAC.properties.title.default = '下载图片';
metas.GIAC.properties.GIAC.properties.icon.default = 'icon-download';

export default () => {
  return metas;
};
