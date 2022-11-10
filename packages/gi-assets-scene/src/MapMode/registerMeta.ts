import { extra } from '@antv/gi-sdk';
import info from './info';
const { GIAC_METAS, deepClone } = extra;
const metas = deepClone(GIAC_METAS);

metas.GIAC.properties.GIAC.properties.title.default = info.name;
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
metas.GIAC.properties.GIAC.properties.icon.default = info.icon;
metas.GIAC.properties.GIAC.properties.isVertical.default = true;
metas.GIAC.properties.GIAC.properties.tooltipPlacement.default = 'right';
export default context => {
  const { keys } = context;
  const options = keys.map(c => {
    return {
      label: c,
      value: c,
    };
  });
  return {
    visible: {
      title: '默认显示',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    type: {
      type: 'string',
      title: '地图类型',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
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
      },
      default: 'amap',
    },
    theme: {
      type: 'string',
      title: '主题',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            label: '明亮',
            value: 'light',
          },
          {
            label: '黑暗',
            value: 'dark',
          },
        ],
      },
      default: 'light',
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
    longitudeKey: {
      type: 'string',
      title: '经度字段',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options,
      },
      default: 'longitude',
    },
    latitudeKey: {
      type: 'string',
      title: '纬度字段',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options,
      },
      default: 'latitude',
    },
    ...metas,
  };
};
