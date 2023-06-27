import $i18n from '../../i18n';
const registerMeta = context => {
  const { services } = context;

  return {
    /** 分类信息 */

    styleCanvas: {
      title: $i18n.get({ id: 'basic.components.CanvasSetting.registerMeta.CanvasStyle', dm: '画布样式' }),
      type: 'object',
      properties: {
        backgroundColor: {
          title: $i18n.get({ id: 'basic.components.CanvasSetting.registerMeta.BackgroundColor', dm: '背景颜色' }),
          'x-component': 'ColorInput',
          'x-decorator': 'FormItem',
          type: 'string',
          default: '#fff',
        },
        backgroundImage: {
          title: $i18n.get({ id: 'basic.components.CanvasSetting.registerMeta.BackgroundImage', dm: '背景图片' }),
          type: 'string',
          'x-component': 'Input',
          'x-decorator': 'FormItem',
          default: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*k9t4QamMuQ4AAAAAAAAAAAAAARQnAQ',
        },
      },
    },
    dragCanvas: {
      title: $i18n.get({ id: 'basic.components.CanvasSetting.registerMeta.DragCanvas', dm: '拖拽画布' }),
      type: 'object',
      properties: {
        disabled: {
          title: $i18n.get({ id: 'basic.components.CanvasSetting.registerMeta.DragDisabled', dm: '拖拽禁用' }),
          'x-component': 'Switch',
          'x-decorator': 'FormItem',
          type: 'boolean',
          default: false,
        },
        direction: {
          title: $i18n.get({ id: 'basic.components.CanvasSetting.registerMeta.DragDirection', dm: '拖拽方向' }),
          type: 'select',
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          'x-component-props': {
            options: [
              {
                label: $i18n.get({ id: 'basic.components.CanvasSetting.registerMeta.Freedom', dm: '自由' }),
                value: 'both',
              },
              {
                label: $i18n.get({ id: 'basic.components.CanvasSetting.registerMeta.XDirection', dm: 'X方向' }),
                value: 'x',
              },
              {
                label: $i18n.get({ id: 'basic.components.CanvasSetting.registerMeta.YDirection', dm: 'Y方向' }),
                value: 'y',
              },
            ],
          },
          default: 'both',
        },
        enableOptimize: {
          title: $i18n.get({ id: 'basic.components.CanvasSetting.registerMeta.DragOptimization', dm: '拖拽优化' }),
          'x-component': 'Switch',
          'x-decorator': 'FormItem',
          type: 'boolean',
          default: false,
        },
      },
    },
    zoomCanvas: {
      title: $i18n.get({ id: 'basic.components.CanvasSetting.registerMeta.ZoomCanvas', dm: '缩放画布' }),
      type: 'object',
      properties: {
        disabled: {
          title: $i18n.get({ id: 'basic.components.CanvasSetting.registerMeta.ZoomDisabled', dm: '缩放禁用' }),
          'x-component': 'Switch',
          'x-decorator': 'FormItem',
          type: 'boolean',
          default: false,
        },
        enableOptimize: {
          title: $i18n.get({ id: 'basic.components.CanvasSetting.registerMeta.ZoomOptimization', dm: '缩放优化' }),
          type: 'boolean',
          'x-component': 'Switch',
          'x-decorator': 'FormItem',
          default: true,
        },
      },
    },
    clearStatus: {
      title: $i18n.get({
        id: 'basic.components.CanvasSetting.registerMeta.ClickTheCanvasToClear',
        dm: '点击画布,清空状态',
      }),
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      type: 'boolean',
      default: true,
    },
    doubleClick: {
      title: $i18n.get({
        id: 'basic.components.CanvasSetting.registerMeta.DoubleClickTheCanvasTo',
        dm: '双击画布,自适应',
      }),
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      type: 'boolean',
      default: true,
    },
  };
};

export default registerMeta;
