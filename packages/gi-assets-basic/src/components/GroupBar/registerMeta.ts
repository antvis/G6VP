import $i18n from '../../i18n';
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
        header: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.SplitLineConfiguration', dm: '分割线配置' }),
      },
      properties: {
        remove: {
          'x-component': 'ArrayItems.Remove',
          'x-component-props': {
            style: {
              position: 'absolute',
              right: 14,
              top: 15,
            },
          },
        },
        position: {
          title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.Location', dm: '位置' }),
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'single',
          },
          default: 'End',
          enum: [
            {
              label: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.Start', dm: '开始' }),
              value: 'Start',
            },
            {
              label: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.End', dm: '结尾' }),
              value: 'End',
            },
          ],
        },
        start: {
          title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.StartMargin', dm: '起始边距' }),
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 0,
        },
        end: {
          title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.EndMargin', dm: '结束边距' }),
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 0,
        },
        color: {
          title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.Color', dm: '颜色' }),
          'x-decorator': 'FormItem',
          'x-component': 'ColorInput',
          default: '#eee',
        },
        size: {
          title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.LineWidth', dm: '线宽' }),
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 1,
        },
      },
    },
  },
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
      title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.AddSplitLine', dm: '添加分割线' }),
    },
  },
};
export const createGroupsMeta = ({ GIAC_ITEMS = [], GIAC_CONTENT_ITEMS = [] }) => {
  return {
    title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.Grouping', dm: '分组' }),
    type: 'array',
    'x-component': 'ArrayCollapse',
    'x-component-props': {},
    enum: [...GIAC_ITEMS, ...GIAC_CONTENT_ITEMS],
    default: [
      {
        components: [],
      },
    ],

    properties: {
      addGroup: {
        type: 'void',
        'x-component': 'ArrayCollapse.Addition',
        title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.AddGroup', dm: '添加分组' }),
      },
    },
    items: {
      type: 'object',
      title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.ClusterSetting', dm: '分组配置' }),
      'x-component-props': {
        style: {
          margin: '1px !important',
        },
      },
      properties: {
        remove: {
          'x-component': 'ArrayCollapse.Remove',
        },
        components: {
          type: 'array',
          title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.IntegratedComponents', dm: '集成组件' }),
          enum: [...GIAC_ITEMS, ...GIAC_CONTENT_ITEMS],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          default: [],
        },
        width: {
          title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.Width', dm: '宽度' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: $i18n.get({
              id: 'basic.components.GroupBar.registerMeta.StringOrNumericType',
              dm: '字符串或数字类型',
            }),
          },
          default: 'auto',
        },
        height: {
          title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.Height', dm: '高度' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: $i18n.get({
              id: 'basic.components.GroupBar.registerMeta.StringOrNumericType',
              dm: '字符串或数字类型',
            }),
          },
        },
        background: {
          title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.BackgroundColor', dm: '背景色' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'ColorInput',
        },
        color: {
          title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.TextColor', dm: '文字颜色' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'ColorInput',
          default: '#000',
        },
        align: {
          title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.Alignment', dm: '对齐方式' }),
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'single',
          },
          default: 'Left',
          enum: [
            {
              label: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.LeftAlignment', dm: '左对齐' }),
              value: 'Left',
            },
            {
              label: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.CenterAlignment', dm: '居中对齐' }),
              value: 'Center',
            },
            {
              label: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.RightAlignment', dm: '右对齐' }),
              value: 'Right',
            },
          ],
        },
        drivers,
      },
    },
  };
};
export default context => {
  const { GIAC_ITEMS = [], GIAC_CONTENT_ITEMS = [] } = context;
  return {
    GI_CONTAINER: {
      title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.IntegratedComponents', dm: '集成组件' }),
      type: 'array',
      enum: [...GIAC_ITEMS, ...GIAC_CONTENT_ITEMS],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      default: [],
    },
    background: {
      title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.BackgroundColor', dm: '背景色' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'ColorInput',
    },
    suspend: {
      title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.Suspension', dm: '悬浮' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    position: {
      title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.Location', dm: '位置' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      default: 'Top',
      enum: [
        {
          label: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.Top', dm: '顶部' }),
          value: 'Top',
        },
        {
          label: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.Bottom', dm: '底部' }),
          value: 'Bottom',
        },
        {
          label: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.LeftSide', dm: '左侧' }),
          value: 'Left',
        },
        {
          label: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.RightSide', dm: '右侧' }),
          value: 'Right',
        },
      ],
    },
    size: {
      title: $i18n.get({ id: 'basic.components.GroupBar.registerMeta.Size', dm: '大小' }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 60,
    },
    left: {
      title: 'Left',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-reactions': {
        dependencies: ['.position'],
        fulfill: {
          schema: {
            'x-visible': "{{$deps[0] === 'Top' || $deps[0] === 'Bottom'}}",
          },
        },
      },
    },
    right: {
      title: 'Right',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-reactions': {
        dependencies: ['.position'],
        fulfill: {
          schema: {
            'x-visible': "{{$deps[0] === 'Top' || $deps[0] === 'Bottom'}}",
          },
        },
      },
    },
    top: {
      title: 'Top',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-reactions': {
        dependencies: ['.position'],
        fulfill: {
          schema: {
            'x-visible': "{{$deps[0] === 'Left' || $deps[0] === 'Right'}}",
          },
        },
      },
    },
    bottom: {
      title: 'Bottom',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-reactions': {
        dependencies: ['.position'],
        fulfill: {
          schema: {
            'x-visible': "{{$deps[0] === 'Left' || $deps[0] === 'Right'}}",
          },
        },
      },
    },
    groups: createGroupsMeta(context),
  };
};
