import { extra } from '@alipay/graphinsight';
const { GIAC_METAS, deepClone } = extra;
const metas = deepClone(GIAC_METAS);
metas.GIAC.properties.GIAC.properties.title.default = '撤销';
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
metas.GIAC.properties.GIAC.properties.icon.default = 'icon-home';
export default () => {
  return {
    ...metas,
  };
};
