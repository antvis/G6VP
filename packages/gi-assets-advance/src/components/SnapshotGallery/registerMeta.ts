import { extra } from '@alipay/graphinsight';
const { deepClone, GIAC_METAS } = extra;
const metas = deepClone(GIAC_METAS);
metas.GIAC.children.title.default = '快照画廊';
metas.GIAC.children.icon.default = 'icon-camera';
metas.GIAC.children.isShowTitle.default = true;
metas.GIAC.children.tooltip.default = '快照画廊(快捷键ctrl+x)'
metas.GIAC.children.tooltipPlacement.default = 'right';

const registerMeta = () => {
  return {
    background: {
      name: '画廊背景色',
      type: 'fill',
      default: '#fff',
    },
    direction: {
      name: '展示方向',
      type: 'radio',
      default: 'horizontal',
      options: [
        {
          label: '水平展示',
          value: 'horizontal',
        },
        {
          label: '纵向展示',
          value: 'vertical',
        },
      ],
    },
    placement: {
      name: '画廊位置',
      type: 'select',
      default: 'LT',
      options: [
        {
          value: 'LT',
          label: '左上',
        },
        {
          value: 'RT',
          label: '右上',
        },
        {
          value: 'LB',
          label: '左下',
        },
        {
          value: 'RB',
          label: '右下',
        },
      ],
    },
    offset: {
      name: '偏移距离',
      type: 'Offset',
      min: 0,
      max: 400,
      default: [100, 20],
    },
    ...metas,
  };
};

export default registerMeta;
