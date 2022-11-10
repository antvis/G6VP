// import { extra } from '@antv/gi-sdk';
// const { deepClone, GIAC_METAS } = extra;

// const metas = deepClone(GIAC_METAS);
// metas.GIAC.properties.GIAC.properties.title.default = '将选中的节点与边添加到新画布中';
// metas.GIAC.properties.GIAC.properties.icon.default = 'icon-home';
// metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
// metas.GIAC.properties.GIAC.properties.tooltipPlacement.default = 'right';

const registerMeta = () => {
  return {
    placement: {
      title: '放置方位',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            value: 'top',
            label: '顶部',
          },
          {
            value: 'bottom',
            label: '底部',
          },
        ],
      },
      default: 'bottom',
    },
    height: {
      title: '页签高度',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 40,
    },
  };
};

export default registerMeta;
