const registerMeta = ({ services }) => {
  const schema = {
    renderMode: {
      title: '渲染模式',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          { value: 'page', label: '整个页面' },
          { value: 'canvas', label: '仅画布' },
        ],
      },
      default: 'page',
    },
    width: {
      title: '宽度',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 120,
    },
    height: {
      title: '高度',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 64,
    },
    rotate: {
      title: '旋转角度',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        min: -90,
        max: 90,
      },
      default: -22,
    },
    zIndex: {
      title: 'z-index',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 9,
    },
    fontSize: {
      title: '字体大小',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        min: 0,
      },
      default: 16,
    },
    fontColor: {
      title: '字体颜色',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'ColorInput',
      default: 'rgba(0,0,0,.15)',
    },
    gap: {
      title: '间距',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Offset',
      'x-component-props': {
        min: 0,
        max: 400,
      },
      default: [100, 100],
    },
    offset: {
      title: '偏移量',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Offset',
      'x-component-props': {
        min: 0,
        max: 400,
      },
      default: [50, 50],
    },
  };

  return schema;
};

export default registerMeta;
