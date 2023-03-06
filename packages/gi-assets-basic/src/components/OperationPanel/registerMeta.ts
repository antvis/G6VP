const driverItem = {
  type: 'void',
  'x-decorator': 'FormItem',
  'x-component': 'FormCollapse',
  'x-component-props': {
    className: 'gi-assets-elements-advance-panel',
    ghost: true,
  },
  properties: {
    config: {
      type: 'object',
      'x-component': 'FormCollapse.CollapsePanel',
      'x-component-props': {
        header: '分割线配置'
      },
      properties: {
        remove: {
          'x-decorator': 'FormItem',
          'x-component': 'ArrayItems.Remove',
        },
        position: {
          title: '位置',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'single',
          },
          default: 'End',
          enum: [
            {
              label: '开始',
              value: 'Start'
            },
            {
              label: '结尾',
              value: 'End'
            }
          ]
        },
        start: {
          title: '起始边距',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 0
        },
        end: {
          title: '结束边距',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 0
        },
        color: {
          title: '颜色',
          'x-decorator': 'FormItem',
          'x-component': 'ColorInput',
          default: '#eee'
        },
        size: {
          title: '线宽',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 1
        }
      }
    }
  }
};
const drivers = {
  type: 'array',
  'x-component': 'ArrayItems',
  'x-component-props': {},
  items: driverItem,
  properties: {
    addGroup: {
      type: 'void',
      'x-component': 'ArrayItems.Addition',
      title: '添加分割线'
    }
  }
};
export default ({ GIAC_ITEMS = [] }) => {
  return {
    position: {
      title: '位置',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      default: 'Top',
      enum:[
        {
          label: '顶部',
          value: 'Top'
        },
        {
          label: '底部',
          value: 'Bottom'
        },
        {
          label: '左侧',
          value: 'Left'
        },
        {
          label: '右侧',
          value: 'Right'
        }
      ]
    },
    size: {
      title: '大小',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 60
    },
    left: {
      title: 'Left',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'auto',
      'x-reactions': {
        dependencies:['.position'],
        fulfill: {
          schema:{
            "x-visible": "{{$deps[0] === 'Top' || $deps[0] === 'Bottom'}}"
          }
        }
      }
    },
    right: {
      title: 'Right',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'auto',
      'x-reactions': {
        dependencies:['.position'],
        fulfill: {
          schema:{
            "x-visible": "{{$deps[0] === 'Top' || $deps[0] === 'Bottom'}}"
          }
        }
      }
    },
    top: {
      title: 'Top',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'auto',
      'x-reactions': {
        dependencies:['.position'],
        fulfill: {
          schema:{
            "x-visible": "{{$deps[0] === 'Left' || $deps[0] === 'Right'}}"
          }
        }
      }
    },
    bottom: {
      title: 'Bottom',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'auto',
      'x-reactions': {
        dependencies:['.position'],
        fulfill: {
          schema:{
            "x-visible": "{{$deps[0] === 'Left' || $deps[0] === 'Right'}}"
          }
        }
      }
    },
    groups: {
      title: '分组',
      type: 'array',
      'x-component': 'ArrayCollapse',
      'x-component-props': {},
      default: [
        {
          components: []
        }
      ],
      properties: {
        addGroup: {
          type: 'void',
          'x-component': 'ArrayCollapse.Addition',
          title: '添加分组'
        }
      },
      items: {
        type: 'object',
        title: '分组配置',
        'x-component-props': {},
        properties: {
          remove: {
            'x-component': 'ArrayCollapse.Remove',
          },
          components:{
            type: 'array',
            title: '集成组件',
            enum: GIAC_ITEMS,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              mode: 'multiple',
            },
            default: [],
          },
          width: {
            title: '宽度',
            type:'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            default: 'auto'
          },
          height: {
            title: '高度',
            type:'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input'
          },
          background: {
            title: '背景色',
            type:'string',
            'x-decorator': 'FormItem',
            'x-component': 'ColorInput',
            default:'#fff'
          },
          color: {
            title: '文字颜色',
            type:'string',
            'x-decorator': 'FormItem',
            'x-component': 'ColorInput',
            default: '#000'
          },
          align: {
            title: '对齐方式',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              mode: 'single',
            },
            default: 'Left',
            enum: [
              {
                label: '左对齐',
                value: 'Left'
              },
              {
                label: '居中对齐',
                value: 'Center'
              },
              {
                label: '右对齐',
                value: 'Right'
              }
            ]
          },
          drivers
        }
      }
    }
  };
};
