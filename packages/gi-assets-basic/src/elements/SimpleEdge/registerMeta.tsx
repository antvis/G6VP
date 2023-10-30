import $i18n from '../../i18n';
import { defaultConfig } from './registerTransform';
const { advanced, color, size } = defaultConfig;
const { keyshape, label, animate } = advanced;

const registerMeta = context => {
  const { keys, schemaData } = context;

  const schema = {
    type: 'object',
    properties: {
      color: {
        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Color', dm: '颜色' }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'ColorInput',
        default: color,
      },
      size: {
        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Size', dm: '大小' }),
        type: 'number',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        default: size,
      },
      label: {
        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Text', dm: '文本' }),
        type: 'string',
        // enum: keys.map(c => {
        //   return {
        //     label: `${c.id} (${c.type})`,
        //     value: c.id,
        //   };
        // }),
        'x-decorator': 'FormItem',
        'x-component': 'GroupSelect',
        'x-component-props': {
          mode: 'multiple',
          schemaData: schemaData.edges,
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
              header: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.AdvancedConfiguration', dm: '高级配置' }),
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
                      header: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Shape', dm: '形状' }),
                      key: 'icon-panel',
                    },
                    properties: {
                      type: {
                        type: 'boolean',
                        title: '类型',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        enum: [
                          {
                            label: '直线',
                            value: 'line-edge',
                          },
                          {
                            label: '二次贝塞尔曲线',
                            value: 'quadratic-edge',
                          },
                          {
                            label: '三次贝塞尔曲线',
                            value: 'cubic-edge',
                          },
                          {
                            label: '三次贝塞尔曲线-垂直',
                            value: 'cubic-vertical-edge',
                          },
                          {
                            label: '三次贝塞尔曲线-水平',
                            value: 'cubic-horizontal-edge',
                          },
                        ],

                        default: keyshape.type,
                      },
                      hasArrow: {
                        type: 'boolean',
                        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Arrow', dm: '箭头' }),
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                        default: true,
                      },

                      customPoly: {
                        type: 'boolean',
                        title: $i18n.get({
                          id: 'basic.elements.SimpleEdge.registerMeta.DefineRadians',
                          dm: '定义弧度',
                        }),
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
                        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Radian', dm: '弧度' }),
                        type: 'number',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        default: keyshape.poly,
                      },

                      lineDash: {
                        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.DottedLine', dm: '虚线' }),
                        type: 'array',
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
                        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Transparency', dm: '透明度' }),
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
                      header: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Label', dm: '标签' }),
                      key: 'keyshape-panel',
                    },
                    properties: {
                      visible: {
                        type: 'boolean',
                        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Visible', dm: '显隐' }),
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                        default: label.visible,
                      },
                      fontSize: {
                        type: 'string',
                        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Size', dm: '大小' }),
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        default: label.fontSize,
                      },
                      offset: {
                        type: 'string',
                        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Offset', dm: '偏移' }),
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
                        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Color', dm: '颜色' }),
                        'x-decorator': 'FormItem',
                        'x-component': 'ColorInput',
                        default: label.fill,
                      },
                      backgroundEnable: {
                        type: 'string',
                        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Background', dm: '背景' }),
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                        default: label.backgroundEnable,
                      },
                      backgroundFill: {
                        type: 'string',
                        title: $i18n.get({
                          id: 'basic.elements.SimpleEdge.registerMeta.BackgroundColor',
                          dm: '背景色',
                        }),
                        'x-decorator': 'FormItem',
                        'x-component': 'ColorInput',
                        default: label.backgroundFill,
                      },
                      backgroundStroke: {
                        type: 'string',
                        title: $i18n.get({
                          id: 'basic.elements.SimpleEdge.registerMeta.BackgroundStroke',
                          dm: '背景描边',
                        }),
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
                      header: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Animation', dm: '动画' }),
                      key: 'aniamte-panel',
                    },
                    properties: {
                      visible: {
                        type: 'boolean',
                        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Switch', dm: '开关' }),
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
                        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Type', dm: '类型' }),
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        enum: [
                          {
                            label: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Ball', dm: '圆球' }),
                            value: 'circle-running',
                          },
                          {
                            label: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.DottedLine', dm: '虚线' }),
                            value: 'line-dash',
                          },
                          {
                            label: $i18n.get({
                              id: 'basic.elements.SimpleEdge.registerMeta.GradualLength',
                              dm: '渐长',
                            }),
                            value: 'line-growth',
                          },
                        ],

                        default: animate.type,
                      },
                      dotColor: {
                        type: 'string',
                        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.BallColor', dm: '圆球颜色' }),
                        'x-decorator': 'FormItem',
                        'x-component': 'ColorInput',
                        default: animate.dotColor,
                      },
                      repeat: {
                        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Repeat', dm: '重复' }),
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                        default: animate.repeat,
                      },
                      duration: {
                        title: $i18n.get({ id: 'basic.elements.SimpleEdge.registerMeta.Duration', dm: '时长' }),
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
