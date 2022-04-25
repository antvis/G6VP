import { extra } from '@alipay/graphinsight';
const { deepClone, GIAC_METAS } = extra;

const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = '清空画布';
metas.GIAC.children.icon.default = 'icon-clear';

export default () => {
  return metas;
};
