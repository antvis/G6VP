import { extra } from '@alipay/graphinsight';
const { GIAC_METAS, deepClone } = extra;
const metas = deepClone(GIAC_METAS);

metas.GIAC.properties.GIAC.properties.title.default = '3D模式';
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
metas.GIAC.properties.GIAC.properties.icon.default = 'icon-windows';
metas.GIAC.properties.GIAC.properties.isVertical.default = true;
metas.GIAC.properties.GIAC.properties.tooltipPlacement.default = 'right';
export default () => {
  return {
    visible: {
      type: 'switch',
      name: '默认开启',
      default: false,
    },
    minSize: {
      type: 'text',
      name: '最小尺寸',
      default: '20%',
    },
    maxSize: {
      type: 'text',
      name: '最大尺寸',
      default: '100%',
    },
    placement: {
      name: '放置方位',
      type: 'select',
      default: 'RB',
      options: [
        {
          value: 'LT',
          label: '左上 / top',
        },
        {
          value: 'RT',
          label: '右上 / right',
        },
        {
          value: 'LB',
          label: '左下 / left',
        },
        {
          value: 'RB',
          label: '右下 / bottom',
        },
      ],
    },
    offset: {
      name: '偏移距离',
      type: 'Offset',
      min: 0,
      max: 400,
      default: [0, 0],
    },
    ...metas,
  };
};
