import { extra } from '@alipay/graphinsight';
const { GIAC_METAS, deepClone } = extra;
const metas = deepClone(GIAC_METAS);

metas.GIAC.children.title.default = '地图模式';
metas.GIAC.children.isShowTitle.default = false;
metas.GIAC.children.icon.default = 'icon-location';
metas.GIAC.children.isVertical.default = true;
metas.GIAC.children.tooltipPlacement.default = 'right';
export default () => {
  return {
    visible: {
      type: 'switch',
      name: '默认开启',
      default: false,
    },
    type: {
      type: 'select',
      name: '地图类型',
      options: [
        {
          label: '高德',
          value: 'amap',
        },
        {
          label: 'MapBox',
          value: 'mapbox',
        },
      ],
      default: 'mapbox',
    },
    theme: {
      type: 'select',
      name: '主题',
      options: [
        {
          label: '明亮',
          value: 'light',
        },
        {
          label: '黑暗',
          value: 'dark',
        },

        {
          label: '普通',
          value: 'normal',
        },
      ],
      default: 'light',
    },
    ...metas,
  };
};
