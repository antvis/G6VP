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

export default () => {
  return {
    visible: {
      title: $i18n.get({ id: 'scene.src.LargeGraph.registerMeta.DefaultDisplay', dm: '默认显示' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    backgroundColor: {
      title: $i18n.get({ id: 'scene.src.LargeGraph.registerMeta.BackgroundColor', dm: '背景颜色' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'ColorInput',
      default: '#fff',
    },
    highlightColor: {
      title: $i18n.get({ id: 'scene.src.LargeGraph.registerMeta.HighlightColor', dm: '高亮颜色' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'ColorInput',
      default: 'red',
    },

    minSize: {
      type: 'string',
      title: $i18n.get({ id: 'scene.src.LargeGraph.registerMeta.MinimumSize', dm: '最小尺寸' }),
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '20%',
    },
    maxSize: {
      type: 'string',
      title: $i18n.get({ id: 'scene.src.LargeGraph.registerMeta.MaximumSize', dm: '最大尺寸' }),
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '100%',
    },
    placement: {
      title: $i18n.get({ id: 'scene.src.LargeGraph.registerMeta.PlacementOrientation', dm: '放置方位' }),
      type: 'string',
      default: 'RB',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            value: 'LT',
            label: $i18n.get({ id: 'scene.src.LargeGraph.registerMeta.TopLeftTop', dm: '左上 / top' }),
          },
          {
            value: 'RT',
            label: $i18n.get({ id: 'scene.src.LargeGraph.registerMeta.TopRightRight', dm: '右上 / right' }),
          },
          {
            value: 'LB',
            label: $i18n.get({ id: 'scene.src.LargeGraph.registerMeta.LowerLeftLeft', dm: '左下 / left' }),
          },
          {
            value: 'RB',
            label: $i18n.get({ id: 'scene.src.LargeGraph.registerMeta.BottomRightBottom', dm: '右下 / bottom' }),
          },
        ],
      },
    },
    offset: {
      title: $i18n.get({ id: 'scene.src.LargeGraph.registerMeta.OffsetDistance', dm: '偏移距离' }),
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
