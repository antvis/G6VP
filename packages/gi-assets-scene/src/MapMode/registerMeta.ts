import { extra } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../i18n';
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
      title: $i18n.get({ id: 'scene.src.MapMode.registerMeta.DefaultDisplay', dm: '默认显示' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    type: {
      type: 'string',
      title: $i18n.get({ id: 'scene.src.MapMode.registerMeta.MapType', dm: '地图类型' }),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            label: $i18n.get({ id: 'scene.src.MapMode.registerMeta.Amap', dm: '高德' }),
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
      title: $i18n.get({ id: 'scene.src.MapMode.registerMeta.Theme', dm: '主题' }),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            label: $i18n.get({ id: 'scene.src.MapMode.registerMeta.Bright', dm: '明亮' }),
            value: 'light',
          },
          {
            label: $i18n.get({ id: 'scene.src.MapMode.registerMeta.Darkness', dm: '黑暗' }),
            value: 'dark',
          },
        ],
      },
      default: 'light',
    },
    minSize: {
      type: 'string',
      title: $i18n.get({ id: 'scene.src.MapMode.registerMeta.MinimumSize', dm: '最小尺寸' }),
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '20%',
    },
    maxSize: {
      type: 'string',
      title: $i18n.get({ id: 'scene.src.MapMode.registerMeta.MaximumSize', dm: '最大尺寸' }),
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '100%',
    },
    placement: {
      title: $i18n.get({ id: 'scene.src.MapMode.registerMeta.PlacementOrientation', dm: '放置方位' }),
      type: 'string',
      default: 'RB',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            value: 'LT',
            label: $i18n.get({ id: 'scene.src.MapMode.registerMeta.TopLeftTop', dm: '左上 / top' }),
          },
          {
            value: 'RT',
            label: $i18n.get({ id: 'scene.src.MapMode.registerMeta.TopRightRight', dm: '右上 / right' }),
          },
          {
            value: 'LB',
            label: $i18n.get({ id: 'scene.src.MapMode.registerMeta.LowerLeftLeft', dm: '左下 / left' }),
          },
          {
            value: 'RB',
            label: $i18n.get({ id: 'scene.src.MapMode.registerMeta.BottomRightBottom', dm: '右下 / bottom' }),
          },
        ],
      },
    },
    offset: {
      title: $i18n.get({ id: 'scene.src.MapMode.registerMeta.OffsetDistance', dm: '偏移距离' }),
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
      title: $i18n.get({ id: 'scene.src.MapMode.registerMeta.LongitudeField', dm: '经度字段' }),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options,
      },
      default: 'longitude',
    },
    latitudeKey: {
      type: 'string',
      title: $i18n.get({ id: 'scene.src.MapMode.registerMeta.LatitudeField', dm: '纬度字段' }),
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
