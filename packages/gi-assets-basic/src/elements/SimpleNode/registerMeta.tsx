import { defaultConfig } from './registerTransform';
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
        enum: [
          { label: '节点ID', value: 'id' },
          { label: '类型', value: 'nodeType' },
        ],
        default: ['id'],
        'x-decorator': 'FormItem',
        'x-component': 'Select',
      },
      advanced: {
        type: 'object',
        'x-decorator': 'FormItem',
        'x-component': 'FormCollapse',
        'x-component-props': {
          bordered: false,
        },
        properties: {
          advancedPanel: {
            type: 'void',
            'x-component': 'FormCollapse.CollapsePanel',
            'x-component-props': {
              header: '高级配置',
            },
            properties: {
              panel: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'FormCollapse',
                'x-component-props': {
                  accordion: true,
                  bordered: false,
                },
                properties: {
                  icon: {
                    type: 'object',
                    'x-decorator': 'FormItem',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                      header: '图标',
                    },
                    properties: {
                      visible: {
                        type: 'boolean',
                        title: '是否显示',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
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
                      },
                      value: {
                        type: 'string',
                        title: '图标',
                        'x-decorator': 'FormItem',
                        'x-component': 'IconSelector',
                      },
                      fill: {
                        type: 'string',
                        title: '颜色',
                        'x-decorator': 'FormItem',
                        'x-component': 'ColorInput',
                      },
                      size: {
                        type: 'string',
                        title: '大小',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                      },
                    },
                  },
                  keyshape: {
                    type: 'object',
                    'x-decorator': 'FormItem',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                      header: '主节点',
                    },
                    properties: {
                      opacity: {
                        type: 'string',
                        title: '透明度',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        max: 1,
                        min: 0,
                        defaltVale: 0.3,
                      },
                    },
                  },
                  label: {
                    type: 'object',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                      header: '文本',
                    },
                    properties: {
                      visible: {
                        type: 'boolean',
                        title: '是否显示',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                      },
                      fill: {
                        title: '文本颜色',
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'ColorInput',
                      },
                      fontSize: {
                        type: 'string',
                        title: '字体大小',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        max: 100,
                        min: 12,
                        defaltVale: 14,
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
                      },
                    },
                  },
                  badge: {
                    type: 'object',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                      header: '徽标',
                    },
                    properties: {
                      visible: {
                        type: 'boolean',
                        title: '是否显示',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
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
                      },
                      value: {
                        type: 'string',
                        title: '字体大小',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
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
