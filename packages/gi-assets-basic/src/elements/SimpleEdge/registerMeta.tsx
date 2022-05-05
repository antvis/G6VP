import { defaultConfig } from './registerTransform';
const { advanced, color, size } = defaultConfig;
const { keyshape, label, animate } = advanced;

const registerMeta = context => {
  const { keys } = context;

  const schema = {
    type: 'object',
    properties: {
      color: {
        title: '颜色',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'ColorInput',
        default: color,
      },
      size: {
        title: '大小',
        type: 'number',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        default: size,
      },
      label: {
        title: '文本',
        type: 'string',
        enum: keys.map(c => {
          return {
            label: `${c.id} (${c.type})`,
            value: c.id,
          };
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          mode: 'multiple',
        },
      },
      advancedPanel: {
        type: 'void',
        'x-decorator': 'FormItem',
        'x-component': 'FormCollapse',
        'x-component-props': {
          className: 'gi-assets-elements-advance-panel',
          ghost: true,
        },
        properties: {
          advanced: {
            type: 'object',
            'x-component': 'FormCollapse.CollapsePanel',
            'x-component-props': {
              header: '高级配置',
              key: 'advanced-panel',
            },
            properties: {
              panel: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'FormCollapse',
                'x-component-props': {
                  className: 'gi-assets-elements-panel',
                  style: {},
                  ghost: true,
                },
                properties: {
                  keyshape: {
                    type: 'object',
                    'x-decorator': 'FormItem',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                      header: '形状',
                      key: 'icon-panel',
                    },
                    properties: {
                      customPoly: {
                        type: 'boolean',
                        title: '定义弧度',
                        default: keyshape.customPoly,
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                        'x-reactions': [
                          {
                            target: 'advanced.keyshape.poly',
                            fulfill: {
                              state: {
                                visible: '{{$self.value}}',
                              },
                            },
                          },
                          {
                            target: 'advanced.icon.fill',
                            fulfill: {
                              state: {
                                visible: '{{$self.value}}',
                              },
                            },
                          },
                          {
                            target: 'advanced.icon.size',
                            fulfill: {
                              state: {
                                visible: '{{$self.value}}',
                              },
                            },
                          },
                        ],
                      },
                      poly: {
                        title: '弧度',
                        type: 'number',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        default: keyshape.poly,
                      },

                      lineDash: {
                        title: '虚线',
                        type: 'number',
                        'x-decorator': 'FormItem',
                        'x-component': 'Offset',
                        'x-component-props': {
                          min: -100,
                          max: 100,
                        },
                        default: keyshape.lineDash,
                      },
                      opacity: {
                        type: 'string',
                        title: '透明度',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        default: keyshape.opacity,
                      },
                    },
                  },
                  label: {
                    type: 'object',
                    'x-decorator': 'FormItem',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                      header: '标签',
                      key: 'keyshape-panel',
                    },
                    properties: {
                      visible: {
                        type: 'boolean',
                        title: '显隐',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                        default: label.visible,
                      },
                      fontSize: {
                        type: 'string',
                        title: '大小',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        default: label.fontSize,
                      },
                      offset: {
                        type: 'string',
                        title: '偏移',
                        'x-decorator': 'FormItem',
                        'x-component': 'Offset',
                        'x-component-props': {
                          min: -100,
                          max: 100,
                        },
                        default: label.offset,
                      },
                      fill: {
                        type: 'string',
                        title: '颜色',
                        'x-decorator': 'FormItem',
                        'x-component': 'ColorInput',
                        default: label.fill,
                      },
                      backgroundEnable: {
                        type: 'string',
                        title: '背景',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                        default: label.backgroundEnable,
                      },
                      backgroundFill: {
                        type: 'string',
                        title: '背景色',
                        'x-decorator': 'FormItem',
                        'x-component': 'ColorInput',
                        default: label.backgroundFill,
                      },
                      backgroundStroke: {
                        type: 'string',
                        title: '背景描边',
                        'x-decorator': 'FormItem',
                        'x-component': 'ColorInput',
                        default: label.backgroundStroke,
                      },
                    },
                  },
                  animate: {
                    type: 'object',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                      header: '动画',
                      key: 'aniamte-panel',
                    },
                    properties: {
                      visible: {
                        type: 'boolean',
                        title: '开关',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                        default: animate.visible,
                        'x-reactions': [
                          {
                            target: 'advanced.animate.type',
                            fulfill: {
                              state: {
                                visible: '{{$self.value}}',
                              },
                            },
                          },
                          {
                            target: 'advanced.animate.dotColor',
                            fulfill: {
                              state: {
                                visible: '{{$self.value}}',
                              },
                            },
                          },
                          {
                            target: 'advanced.animate.repeat',
                            fulfill: {
                              state: {
                                visible: '{{$self.value}}',
                              },
                            },
                          },
                          {
                            target: 'advanced.animate.duration',
                            fulfill: {
                              state: {
                                visible: '{{$self.value}}',
                              },
                            },
                          },
                        ],
                      },
                      type: {
                        title: '类型',
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        enum: [
                          { label: '圆球', value: 'circle-running' },
                          { label: '虚线', value: 'line-dash' },
                          { label: '渐长', value: 'line-growth' },
                        ],
                        default: animate.type,
                      },
                      dotColor: {
                        type: 'string',
                        title: '圆球颜色',
                        'x-decorator': 'FormItem',
                        'x-component': 'ColorInput',
                        default: animate.dotColor,
                      },
                      repeat: {
                        title: '重复',
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                        default: animate.repeat,
                      },
                      duration: {
                        title: '时长',
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        default: animate.duration,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return schema;
};
export default registerMeta;
