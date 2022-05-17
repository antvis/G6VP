import { extra } from '@alipay/graphinsight';
const { deepClone, GIAC_METAS } = extra;
const metas = deepClone(GIAC_METAS);
metas.GIAC.properties.GIAC.properties.title.default = '快照画廊';
metas.GIAC.properties.GIAC.properties.icon.default = 'icon-camera';
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
metas.GIAC.properties.GIAC.properties.tooltip.default = '快照画廊(快捷键ctrl+x)';
metas.GIAC.properties.GIAC.properties.tooltipPlacement.default = 'right';

const registerMeta = () => {
  return {
    background: {
      title: '画廊背景',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'ColorInput',
      default: '#fff',
    },
    direction: {
      title: '展示方向',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
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
      default: 'horizontal',
    },
    placement: {
      title: '画廊位置',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
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
      default: 'LT',
    },
    offset: {
      title: '偏移距离',
      type: 'array',
      'x-decorator': 'FormItem',
      'x-component': 'Offset',
      default: [20, 20],
    },
    ...metas,
  };
};

export default registerMeta;
