import $i18n from '../../i18n';
import { defaultConfig } from './registerTransform';

const { icon, keyshape, label, badge } = defaultConfig.advanced;
const registerMeta = context => {
  const { schemaData } = context;
  const schema = {
    type: 'object',
    properties: {
      size: {
        title: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Size', dm: '大小' }),
        type: 'number',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        default: defaultConfig.size,
      },
      color: {
        title: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Color', dm: '颜色' }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'ColorInput',
        default: defaultConfig.color,
      },
      label: {
        title: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Text', dm: '文本' }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'GroupSelect',
        'x-component-props': {
          mode: 'multiple',
          schemaData: schemaData.nodes,
        },
      },
      advancedPanel: {
        type: 'void',
        'x-decorator': 'FormItem',
        'x-component': 'FormCollapse',
        'x-component-props': {
          className: 'gi-assets-elements-advance-panel',
          // style: { background: 'blue' },
          ghost: true,
        },
        properties: {
          advanced: {
            type: 'object',
            'x-component': 'FormCollapse.CollapsePanel',
            'x-component-props': {
              header: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.AdvancedConfiguration', dm: '高级配置' }),
              // 暂时不设置高级配置默认收起，否则下面的 visible 控制就失效了
              key: 'advanced-panel',
            },
            properties: {
              panel: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'FormCollapse',
                'x-component-props': {
                  className: 'gi-assets-elements-panel',
                  style: {
                    // background: 'red',
                    // margin: '-16px',
                  },
                  ghost: true,
                },
                properties: {
                  icon: {
                    type: 'object',
                    'x-decorator': 'FormItem',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                      header: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Icon', dm: '图标' }),
                      key: 'icon-panel',
                    },
                    properties: {
                      visible: {
                        type: 'boolean',
                        title: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Visible', dm: '显隐' }),
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
                        title: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Type', dm: '类型' }),
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        enum: [
                          {
                            label: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Text', dm: '文本' }),
                            value: 'text',
                          },
                          {
                            label: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.FontIcon', dm: '字体图标' }),
                            value: 'font',
                          },
                        ],
                        default: icon.type,
                      },
                      value: {
                        type: 'string',
                        title: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Icon', dm: '图标' }),
                        'x-decorator': 'FormItem',
                        'x-component': 'IconPicker',
                        default: icon.value,
                      },
                      fill: {
                        type: 'string',
                        title: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Color', dm: '颜色' }),
                        'x-decorator': 'FormItem',
                        'x-component': 'ColorInput',
                        default: icon.fill,
                      },
                      // size: {
                      //   type: 'string',
                      //   title: '大小',
                      //   'x-decorator': 'FormItem',
                      //   'x-component': 'NumberPicker',
                      //   default: icon.size,
                      // },
                    },
                  },
                  keyshape: {
                    type: 'object',
                    'x-decorator': 'FormItem',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                      header: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Node', dm: '节点' }),
                      key: 'keyshape-panel',
                    },
                    properties: {
                      fillOpacity: {
                        type: 'string',
                        title: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Transparency', dm: '透明度' }),
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        max: 1,
                        min: 0,
                        default: keyshape.fillOpacity,
                      },
                      type: {
                        type: 'string',
                        title: '类型',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        enum: [
                          {
                            label: '圆形',
                            value: 'circle-node',
                          },
                          {
                            label: '方形',
                            value: 'rect-node',
                          },
                          {
                            label: '菱形',
                            value: 'diamond-node',
                          },
                        ],
                        default: keyshape.type,
                      },
                    },
                  },
                  label: {
                    type: 'object',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                      header: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Text', dm: '文本' }),
                      key: 'label-panel',
                    },
                    properties: {
                      visible: {
                        type: 'boolean',
                        title: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Switch', dm: '开关' }),
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
                        title: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Color', dm: '颜色' }),
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'ColorInput',
                        default: label.fill,
                      },
                      fontSize: {
                        type: 'string',
                        title: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Size', dm: '大小' }),
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        max: 100,
                        min: 12,
                        default: label.fontSize,
                      },
                      position: {
                        title: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Location', dm: '位置' }),
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        enum: [
                          {
                            label: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Top', dm: '顶部' }),
                            value: 'top',
                          },
                          {
                            label: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Bottom', dm: '底部' }),
                            value: 'bottom',
                          },
                          {
                            label: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.LeftSide', dm: '左侧' }),
                            value: 'left',
                          },
                          {
                            label: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.RightSide', dm: '右侧' }),
                            value: 'right',
                          },
                          {
                            label: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Middle', dm: '中间' }),
                            value: 'center',
                          },
                        ],

                        default: label.position,
                      },
                    },
                  },
                  badge: {
                    type: 'object',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                      header: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Logo', dm: '徽标' }),
                      key: 'badge-panel',
                    },
                    properties: {
                      visible: {
                        type: 'boolean',
                        title: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Visible', dm: '显隐' }),
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
                        title: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Type', dm: '类型' }),
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        enum: [
                          {
                            label: $i18n.get({
                              id: 'basic.elements.SimpleNode.registerMeta.FieldMapping',
                              dm: '字段映射',
                            }),
                            value: 'mapping',
                          },
                          {
                            label: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Text', dm: '文本' }),
                            value: 'text',
                          },
                          {
                            label: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.FontIcon', dm: '字体图标' }),
                            value: 'font',
                          },
                        ],

                        default: badge.type,
                      },
                      value: {
                        type: 'string',
                        title: $i18n.get({ id: 'basic.elements.SimpleNode.registerMeta.Text', dm: '文本' }),
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
