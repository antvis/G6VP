import $i18n from '../../i18n'; // import { extra } from '@antv/gi-sdk';
// const { deepClone, GIAC_METAS } = extra;

// const metas = deepClone(GIAC_METAS);
// metas.GIAC.properties.GIAC.properties.title.default = '将选中的节点与边添加到新画布中';
// metas.GIAC.properties.GIAC.properties.icon.default = 'icon-home';
// metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
// metas.GIAC.properties.GIAC.properties.tooltipPlacement.default = 'right';

const registerMeta = () => {
  return {
    placement: {
      title: $i18n.get({ id: 'advance.components.Sheetbar.registerMeta.PlacementOrientation', dm: '放置方位' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            value: 'top',
            label: $i18n.get({ id: 'advance.components.Sheetbar.registerMeta.Top', dm: '顶部' }),
          },
          {
            value: 'bottom',
            label: $i18n.get({ id: 'advance.components.Sheetbar.registerMeta.Bottom', dm: '底部' }),
          },
        ],
      },
      default: 'bottom',
    },
    height: {
      title: $i18n.get({ id: 'advance.components.Sheetbar.registerMeta.TabHeight', dm: '页签高度' }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 40,
    },
    position: {
      title: $i18n.get({ id: 'sdk.src.components.const.OffsetDistance', dm: '偏移距离' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Offset',
      default: [0, 0],
    },
  };
};

export default registerMeta;
