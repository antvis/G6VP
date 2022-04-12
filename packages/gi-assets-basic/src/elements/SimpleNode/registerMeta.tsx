import { defaultConfig } from './registerTransform';

const { icon, keyshape, label, badge } = defaultConfig.advanced;
const registerMeta = context => {
  const { keys } = context;

  const schema = {
    type: 'object',
    properties: {
      size: {
        title: '大小',
        type: 'number',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        default: defaultConfig.size,
      },
      color: {
        title: '颜色',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'ColorInput',
        default: defaultConfig.color,
      },
      label: {
        title: '文本',
        type: 'string',
        //todo: 显示文本属性根据 data 生成
        enum: keys.map(c => {
          return { label: c, value: c };
        }),
        // default: ['id'],
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
        // 'x-component-props': {
        //   bordered: false,
        //   // 设置手风琴默认，不允许收起高级配置，否则下面的 visible 控制就失效了
        //   accordion: true,
        // },
        properties: {
          advanced: {
            type: 'object',
            'x-component': 'FormCollapse.CollapsePanel',
            'x-component-props': {
              header: '高级配置',
              // 暂时不设置高级配置默认收起，否则下面的 visible 控制就失效了
              key: 'advanced-panel',
            },
            properties: {
              panel: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'FormCollapse',
                'x-component-props': {
                  bordered: false,
                },
                properties: {
                  icon: {
                    type: 'object',
                    'x-decorator': 'FormItem',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                      header: '图标',
                      key: 'icon-panel',
                    },
                    properties: {
                      visible: {
                        type: 'boolean',
                        title: '是否显示',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                        'x-reactions': [
                          {
                            target: 'advanced.icon.type',
                            fulfill: {
                              state: {
                                visible: '{{$self.value}}',
                              },
                            },
                          },
                          {
                            target: 'advanced.icon.value',
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
                      type: {
                        type: 'string',
                        title: '类型',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        enum: [
                          { label: '文本', value: 'text' },
                          { label: '字体图标', value: 'font' },
                        ],
                        default: icon.type,
                      },
                      value: {
                        type: 'string',
                        title: '图标',
                        'x-decorator': 'FormItem',
                        'x-component': 'IconSelector',
                        default: icon.value,
                      },
                      fill: {
                        type: 'string',
                        title: '颜色',
                        'x-decorator': 'FormItem',
                        'x-component': 'ColorInput',
                        default: icon.fill,
                      },
                      size: {
                        type: 'string',
                        title: '大小',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        default: icon.size,
                      },
                    },
                  },
                  keyshape: {
                    type: 'object',
                    'x-decorator': 'FormItem',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                      header: '主节点',
                      key: 'keyshape-panel',
                    },
                    properties: {
                      fillOpacity: {
                        type: 'string',
                        title: '透明度',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        max: 1,
                        min: 0,
                        default: keyshape.fillOpacity,
                      },
                    },
                  },
                  label: {
                    type: 'object',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                      header: '文本',
                      key: 'label-panel',
                    },
                    properties: {
                      visible: {
                        type: 'boolean',
                        title: '是否显示',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                        default: label.visible,
                        'x-reactions': [
                          {
                            target: 'advanced.label.fill',
                            fulfill: {
                              state: {
                                visible: '{{$self.value}}',
                              },
                            },
                          },
                          {
                            target: 'advanced.label.fontSize',
                            fulfill: {
                              state: {
                                visible: '{{$self.value}}',
                              },
                            },
                          },
                          {
                            target: 'advanced.label.position',
                            fulfill: {
                              state: {
                                visible: '{{$self.value}}',
                              },
                            },
                          },
                        ],
                      },
                      fill: {
                        title: '文本颜色',
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'ColorInput',
                        default: label.fill,
                      },
                      fontSize: {
                        type: 'string',
                        title: '字体大小',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        max: 100,
                        min: 12,
                        default: label.fontSize,
                      },
                      position: {
                        title: '展示位置',
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        enum: [
                          { label: '顶部', value: 'top' },
                          { label: '底部', value: 'bottom' },
                          { label: '左侧', value: 'left' },
                          { label: '右侧', value: 'right' },
                          { label: '中间', value: 'center' },
                        ],
                        default: label.position,
                      },
                    },
                  },
                  badge: {
                    type: 'object',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                      header: '徽标',
                      key: 'badge-panel',
                    },
                    properties: {
                      visible: {
                        type: 'boolean',
                        title: '是否显示',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                        default: badge.visible,
                        'x-reactions': [
                          {
                            target: 'advanced.badge.type',
                            fulfill: {
                              state: {
                                visible: '{{$self.value}}',
                              },
                            },
                          },
                          {
                            target: 'advanced.badge.value',
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
                          { label: '文本', value: 'text' },
                          { label: '字体图标', value: 'font' },
                        ],
                        default: badge.type,
                      },
                      value: {
                        type: 'string',
                        title: '文本',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        default: badge.value,
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
