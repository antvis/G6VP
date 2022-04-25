import { extra } from '@alipay/graphinsight';
const { deepClone, GIAC_METAS } = extra;

const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = '下载图片';
metas.GIAC.children.icon.default = 'icon-download';

export default () => {
  return metas;
};
