import { extra } from '@alipay/graphinsight';
const { deepClone, GIAC_METAS } = extra;

const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = '将选中的节点与边添加到新画布中';
metas.GIAC.children.icon.default = 'icon-home';
metas.GIAC.children.isShowTitle.default = false;
metas.GIAC.children.tooltipPlacement.default = 'right';

const registerMeta = () => {
  return {
    ...metas,
  };
};

export default registerMeta;
