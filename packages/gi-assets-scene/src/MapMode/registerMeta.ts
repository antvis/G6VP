import { extra } from '@alipay/graphinsight';
const { GIAC_METAS, deepClone } = extra;
const metas = deepClone(GIAC_METAS);

metas.GIAC.children.title.default = '地图模式';
metas.GIAC.children.isShowTitle.default = false;
metas.GIAC.children.icon.default = 'icon-home';
metas.GIAC.children.tooltipPlacement.default = 'right';
export default () => {
  return {
    visible: {
      type: 'switch',
      name: '默认开启',
      default: false,
    },
    ...metas,
  };
};
