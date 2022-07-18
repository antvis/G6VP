const registerMeta = context => {
  const { services } = context;

  return {
    /** 分类信息 */

    styleCanvas: {
      title: '画布样式',
      type: 'object',
      properties: {
        backgroundColor: {
          title: '背景颜色',
          'x-component': 'ColorInput',
          'x-decorator': 'FormItem',
          type: 'string',
          default: '#fff',
        },
        backgroundImage: {
          title: '背景图片',
          type: 'string',
          'x-component': 'Input',
          'x-decorator': 'FormItem',
          default: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*k9t4QamMuQ4AAAAAAAAAAAAAARQnAQ',
        },
      },
    },
    dragCanvas: {
      title: '画布样式',
      type: 'object',
      properties: {
        disabled: {
          title: '拖拽禁用',
          'x-component': 'Switch',
          'x-decorator': 'FormItem',
          type: 'boolean',
          default: false,
        },
        direction: {
          title: '拖拽方向',
          type: 'select',
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          'x-component-props': {
            options: [
              {
                label: '自由',
                value: 'both',
              },
              {
                label: 'X方向',
                value: 'x',
              },
              {
                label: 'Y方向',
                value: 'y',
              },
            ],
          },
          default: 'both',
        },
        enableOptimize: {
          title: '拖拽优化',
          'x-component': 'Switch',
          'x-decorator': 'FormItem',
          type: 'boolean',
          default: false,
        },
      },
    },
    zoomCanvas: {
      title: '画布样式',
      type: 'object',
      properties: {
        disabled: {
          title: '缩放禁用',
          'x-component': 'Switch',
          'x-decorator': 'FormItem',
          type: 'boolean',
          default: false,
        },
        enableOptimize: {
          title: '缩放优化',
          type: 'boolean',
          'x-component': 'Switch',
          'x-decorator': 'FormItem',
          default: true,
        },
      },
    },
  };
};

export default registerMeta;
