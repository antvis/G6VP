import { extra } from '@alipay/graphinsight';
const { deepClone, GIAC_METAS } = extra;

const metas = deepClone(GIAC_METAS);
metas.GIAC.properties.GIAC.properties.title.default = '将选中的节点与边添加到新画布中';
metas.GIAC.properties.GIAC.properties.icon.default = 'icon-plus';
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
metas.GIAC.properties.GIAC.properties.tooltipPlacement.default = 'right';

const registerMeta = () => {
  return {
    ...metas,
  };
};

export default registerMeta;
