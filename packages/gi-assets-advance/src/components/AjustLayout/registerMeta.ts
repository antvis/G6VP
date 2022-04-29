import { extra } from '@alipay/graphinsight';

const { GIAC_CONTENT_METAS, deepClone } = extra;

const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.children.title.default = '子图布局';
metas.GIAC_CONTENT.children.icon.default = 'icon-branches';

export default () => {
  return metas;
};
