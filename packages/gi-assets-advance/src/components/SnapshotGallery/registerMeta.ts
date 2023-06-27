import { extra } from '@antv/gi-sdk';
import $i18n from '../../i18n';
const { deepClone, GIAC_METAS } = extra;
const metas = deepClone(GIAC_METAS);
metas.GIAC.properties.GIAC.properties.title.default = $i18n.get({
  id: 'advance.components.SnapshotGallery.registerMeta.SnapshotGallery',
  dm: '快照画廊',
});
metas.GIAC.properties.GIAC.properties.icon.default = 'icon-camera';
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
metas.GIAC.properties.GIAC.properties.tooltip.default = $i18n.get({
  id: 'advance.components.SnapshotGallery.registerMeta.SnapshotGalleryShortcutCtrlX',
  dm: '快照画廊(快捷键ctrl+x)',
});
metas.GIAC.properties.GIAC.properties.tooltipPlacement.default = 'right';

const registerMeta = () => {
  return {
    background: {
      title: $i18n.get({ id: 'advance.components.SnapshotGallery.registerMeta.GalleryBackground', dm: '画廊背景' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'ColorInput',
      default: '#fff',
    },
    direction: {
      title: $i18n.get({ id: 'advance.components.SnapshotGallery.registerMeta.DisplayDirection', dm: '展示方向' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            label: $i18n.get({
              id: 'advance.components.SnapshotGallery.registerMeta.HorizontalDisplay',
              dm: '水平展示',
            }),
            value: 'horizontal',
          },
          {
            label: $i18n.get({ id: 'advance.components.SnapshotGallery.registerMeta.VerticalDisplay', dm: '纵向展示' }),
            value: 'vertical',
          },
        ],
      },
      default: 'horizontal',
    },
    placement: {
      title: $i18n.get({ id: 'advance.components.SnapshotGallery.registerMeta.GalleryLocation', dm: '画廊位置' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            value: 'LT',
            label: $i18n.get({ id: 'advance.components.SnapshotGallery.registerMeta.UpperLeft', dm: '左上' }),
          },
          {
            value: 'RT',
            label: $i18n.get({ id: 'advance.components.SnapshotGallery.registerMeta.UpperRight', dm: '右上' }),
          },
          {
            value: 'LB',
            label: $i18n.get({ id: 'advance.components.SnapshotGallery.registerMeta.LowerLeft', dm: '左下' }),
          },
          {
            value: 'RB',
            label: $i18n.get({ id: 'advance.components.SnapshotGallery.registerMeta.LowerRight', dm: '右下' }),
          },
        ],
      },
      default: 'LT',
    },
    offset: {
      title: $i18n.get({ id: 'advance.components.SnapshotGallery.registerMeta.OffsetDistance', dm: '偏移距离' }),
      type: 'array',
      'x-decorator': 'FormItem',
      'x-component': 'Offset',
      default: [20, 20],
    },
    ...metas,
  };
};

export default registerMeta;
