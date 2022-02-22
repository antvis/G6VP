import { extra } from '@alipay/graphinsight';
const { GIAC_METAS, deepClone } = extra;
const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = '撤销';
metas.GIAC.children.isShowTitle.default = false;
metas.GIAC.children.icon.default = 'icon-home';
export default () => {
  return {
    ...metas,
  };
};
