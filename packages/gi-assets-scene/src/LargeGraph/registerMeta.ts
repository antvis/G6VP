import { extra } from '@alipay/graphinsight';
import info from './info';
const { GIAC_METAS, deepClone } = extra;
const metas = deepClone(GIAC_METAS);

metas.GIAC.properties.GIAC.properties.title.default = info.name;
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
metas.GIAC.properties.GIAC.properties.icon.default = info.icon;
metas.GIAC.properties.GIAC.properties.isVertical.default = true;
metas.GIAC.properties.GIAC.properties.tooltipPlacement.default = 'right';

export default () => {
  return {
    visible: {
      title: '默认显示',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    backgroundColor: {
      title: '背景颜色',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'ColorInput',
      default: '#fff',
    },
    highlightColor: {
      title: '高亮颜色',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'ColorInput',
      default: 'red',
    },

    minSize: {
      type: 'string',
      title: '最小尺寸',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '20%',
    },
    maxSize: {
      type: 'string',
      title: '最大尺寸',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '100%',
    },
    placement: {
      title: '放置方位',
      type: 'string',
      default: 'RB',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
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
    },
    offset: {
      title: '偏移距离',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Offset',
      'x-component-props': {
        min: 0,
        max: 400,
      },
      default: [0, 0],
    },
    ...metas,
  };
};
