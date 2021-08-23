const registerMeta = context => {
  const { services } = context;

  return {
    /** 分类信息 */
    dragCanvas: {
      name: '拖拽画布',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        enable: {
          name: '开关',
          type: 'switch',
          default: true,
          statusText: true,
        },
        direction: {
          name: '方向',
          type: 'select',
          useFont: true,
          default: 'both',
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
        enableOptimize: {
          name: '优化',
          type: 'switch',
          default: true,
          statusText: true,
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
      },
    },
    styleCanvas: {
      name: '画布样式',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        background: {
          name: '背景色',
          type: 'fill',
          default: '#02024a',
        },
        backgroundImage: {
          name: '背景图片',
          type: 'image',
          default: 'https://img.alicdn.com/imgextra/i2/O1CN01X2QkBc22Mb7mxeQeE_!!6000000007106-2-tps-3840-1904.png',
        },
      },
    },
  };
};

export default registerMeta;
