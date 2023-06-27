import $i18n from '../i18n';
const GIAC_CONTENT = {
  type: 'void',
  'x-decorator': 'FormItem',
  'x-component': 'FormCollapse',
  'x-component-props': {
    ghost: true,
    className: 'gi-site-collapse-item',
  },
  properties: {
    GIAC_CONTENT: {
      type: 'object',
      'x-decorator': 'FormItem',
      'x-component': 'FormCollapse.CollapsePanel',
      'x-component-props': {
        header: $i18n.get({ id: 'sdk.src.components.const.ContainerConfiguration', dm: '容器配置' }),
      },
      properties: {
        visible: {
          title: $i18n.get({ id: 'sdk.src.components.const.DefaultDisplay', dm: '默认显示' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: false,
        },
        disabled: {
          title: $i18n.get({ id: 'sdk.src.components.const.FeatureDisabled', dm: '功能禁用' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: false,
        },
        isShowTitle: {
          title: $i18n.get({ id: 'sdk.src.components.const.DisplayName', dm: '显示名称' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-reactions': [
            {
              target: 'GIAC_CONTENT.title',
              fulfill: {
                state: {
                  visible: '{{$self.value}}',
                },
              },
            },
          ],

          default: true,
        },
        title: {
          title: $i18n.get({ id: 'sdk.src.components.const.EnterAName', dm: '填写名称' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: $i18n.get({ id: 'sdk.src.components.const.UnnamedComponent', dm: '未命名组件' }),
        },
        isShowIcon: {
          title: $i18n.get({ id: 'sdk.src.components.const.ShowIcon', dm: '显示图标' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: true,
          'x-reactions': [
            {
              target: 'GIAC_CONTENT.icon',
              fulfill: {
                state: {
                  visible: '{{$self.value}}',
                },
              },
            },
          ],
        },
        icon: {
          title: $i18n.get({ id: 'sdk.src.components.const.SelectIcon', dm: '选择图标' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: 'icon-star',
        },
        isShowTooltip: {
          title: $i18n.get({ id: 'sdk.src.components.const.PromptBox', dm: '提示框' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-reactions': [
            {
              target: 'GIAC_CONTENT.tooltip',
              fulfill: {
                state: {
                  visible: '{{$self.value}}',
                },
              },
            },
          ],

          default: true,
        },
        tooltip: {
          title: $i18n.get({ id: 'sdk.src.components.const.PromptContent', dm: '提示内容' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: '',
        },
        tooltipColor: {
          title: $i18n.get({ id: 'sdk.src.components.const.PromptColor', dm: '提示颜色' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'ColorInput',
          default: '#3056e3',
        },
        tooltipPlacement: {
          title: $i18n.get({ id: 'sdk.src.components.const.PromptOrientation', dm: '提示方位' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            options: [
              {
                value: 'top',
                label: $i18n.get({ id: 'sdk.src.components.const.Above', dm: '上方' }),
              },
              {
                value: 'left',
                label: $i18n.get({ id: 'sdk.src.components.const.LeftSquare', dm: '左方' }),
              },
              {
                value: 'right',
                label: $i18n.get({ id: 'sdk.src.components.const.RightSide', dm: '右方' }),
              },
              {
                value: 'bottom',
                label: $i18n.get({ id: 'sdk.src.components.const.Below', dm: '下方' }),
              },
            ],
          },
          default: 'right',
        },
        hasDivider: {
          title: $i18n.get({ id: 'sdk.src.components.const.Separator', dm: '分隔符' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: false,
        },
        height: {
          title: $i18n.get({ id: 'sdk.src.components.const.UnitHeight', dm: '单元高度' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: '60px',
        },
        isVertical: {
          title: $i18n.get({ id: 'sdk.src.components.const.VerticalArrangement', dm: '垂直排列' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',

          default: true,
        },
        containerType: {
          title: $i18n.get({ id: 'sdk.src.components.const.ContainerType', dm: '容器类型' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          enum: [
            {
              label: $i18n.get({ id: 'sdk.src.components.const.CommonDiv', dm: '普通DIV' }),
              value: 'div',
            },
            {
              label: $i18n.get({ id: 'sdk.src.components.const.Drawer', dm: '抽屉' }),
              value: 'drawer',
            },
            {
              label: $i18n.get({ id: 'sdk.src.components.const.PopUpWindow', dm: '弹窗' }),
              value: 'modal',
            },
          ],

          default: 'div',
        },
        containerAnimate: {
          title: $i18n.get({
            id: 'sdk.src.components.const.ContainerAnimationValidOnlyFor',
            dm: '容器动画（仅DIV有效）',
          }),
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: false,
        },
        containerPlacement: {
          title: $i18n.get({ id: 'sdk.src.components.const.ContainerLocation', dm: '容器位置' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            options: [
              {
                value: 'LT',
                label: $i18n.get({ id: 'sdk.src.components.const.TopLeftTop', dm: '左上 / top' }),
              },
              {
                value: 'LB',
                label: $i18n.get({ id: 'sdk.src.components.const.LowerLeftLeft', dm: '左下 / left' }),
              },
              {
                value: 'RT',
                label: $i18n.get({ id: 'sdk.src.components.const.TopRightRight', dm: '右上 / right' }),
              },
              {
                value: 'RB',
                label: $i18n.get({ id: 'sdk.src.components.const.BottomRightBottom', dm: '右下 / bottom' }),
              },
            ],
          },
          default: 'RT',
        },
        offset: {
          title: $i18n.get({ id: 'sdk.src.components.const.OffsetDistance', dm: '偏移距离' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Offset',
          default: [0, 0],
        },
        containerWidth: {
          title: $i18n.get({ id: 'sdk.src.components.const.ContainerWidth', dm: '容器宽度' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: '350px',
        },
        containerHeight: {
          title: $i18n.get({ id: 'sdk.src.components.const.ContainerHeight', dm: '容器高度' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: 'calc(100% - 100px)',
        },

        contaienrMask: {
          title: $i18n.get({ id: 'sdk.src.components.const.ContainerMask', dm: '容器遮罩' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-component-props': {},
          default: false,
        },
      },
    },
  },
};
const GIAC = {
  type: 'void',
  'x-decorator': 'FormItem',
  'x-component': 'FormCollapse',
  'x-component-props': {
    ghost: true,
    className: 'gi-site-collapse-item',
  },
  properties: {
    GIAC: {
      type: 'object',
      'x-decorator': 'FormItem',
      'x-component': 'FormCollapse.CollapsePanel',
      'x-component-props': {
        header: $i18n.get({ id: 'sdk.src.components.const.ContainerConfiguration', dm: '容器配置' }),
      },
      properties: {
        visible: {
          title: $i18n.get({ id: 'sdk.src.components.const.DefaultDisplay', dm: '默认显示' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: false,
        },
        disabled: {
          title: $i18n.get({ id: 'sdk.src.components.const.FeatureDisabled', dm: '功能禁用' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: false,
        },
        isShowTitle: {
          title: $i18n.get({ id: 'sdk.src.components.const.DisplayName', dm: '显示名称' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-reactions': [
            {
              target: 'GIAC_CONTENT.title',
              fulfill: {
                state: {
                  visible: '{{$self.value}}',
                },
              },
            },
          ],

          default: false,
        },
        title: {
          title: $i18n.get({ id: 'sdk.src.components.const.EnterAName', dm: '填写名称' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: $i18n.get({ id: 'sdk.src.components.const.TimeSeriesAnalysis', dm: '时序分析' }),
        },
        isShowIcon: {
          title: $i18n.get({ id: 'sdk.src.components.const.ShowIcon', dm: '显示图标' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: true,
          'x-reactions': [
            {
              target: 'GIAC_CONTENT.icon',
              fulfill: {
                state: {
                  visible: '{{$self.value}}',
                },
              },
            },
          ],
        },
        icon: {
          title: $i18n.get({ id: 'sdk.src.components.const.SelectIcon', dm: '选择图标' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: 'icon-star',
        },
        isShowTooltip: {
          title: $i18n.get({ id: 'sdk.src.components.const.PromptBox', dm: '提示框' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-reactions': [
            {
              target: 'GIAC_CONTENT.tooltip',
              fulfill: {
                state: {
                  visible: '{{$self.value}}',
                },
              },
            },
          ],

          default: true,
        },
        tooltip: {
          title: $i18n.get({ id: 'sdk.src.components.const.PromptContent', dm: '提示内容' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: '',
        },
        tooltipColor: {
          title: $i18n.get({ id: 'sdk.src.components.const.PromptColor', dm: '提示颜色' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'ColorInput',
          default: '#3056e3',
        },
        tooltipPlacement: {
          title: $i18n.get({ id: 'sdk.src.components.const.PromptOrientation', dm: '提示方位' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            options: [
              {
                value: 'top',
                label: $i18n.get({ id: 'sdk.src.components.const.Above', dm: '上方' }),
              },
              {
                value: 'left',
                label: $i18n.get({ id: 'sdk.src.components.const.LeftSquare', dm: '左方' }),
              },
              {
                value: 'right',
                label: $i18n.get({ id: 'sdk.src.components.const.RightSide', dm: '右方' }),
              },
              {
                value: 'bottom',
                label: $i18n.get({ id: 'sdk.src.components.const.Below', dm: '下方' }),
              },
            ],

            showInPanel: {
              conditions: [['.isShowTooltip', '$eq', true]],
            },
          },
          default: 'right',
        },
        hasDivider: {
          title: $i18n.get({ id: 'sdk.src.components.const.Separator', dm: '分隔符' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: false,
        },
        height: {
          title: $i18n.get({ id: 'sdk.src.components.const.UnitHeight', dm: '单元高度' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: '46px',
        },
        isVertical: {
          title: $i18n.get({ id: 'sdk.src.components.const.VerticalArrangement', dm: '垂直排列' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-component-props': {
            showInPanel: {
              conditions: [
                ['.isShowIcon', '$eq', true],
                ['.isShowTitle', '$eq', true],
              ],
            },
          },
          default: true,
        },
      },
    },
  },
};

const GI_CONTAINER_INDEX = {
  title: $i18n.get({ id: 'sdk.src.components.const.SortPosition', dm: '排序位置' }),
  type: 'number',
  'x-decorator': 'FormItem',
  'x-component': 'NumberPicker',
  'x-component-props': {
    min: 0,
    max: 15,
  },
  default: 2,
};

export const GIAC_CONTENT_METAS = {
  GI_CONTAINER_INDEX,
  GIAC_CONTENT,
};
export const GIAC_METAS = {
  GI_CONTAINER_INDEX,
  GIAC,
};
export const GIAC_CONTENT_PROPS = {
  GI_CONTAINER_INDEX: 0,
  GIAC_CONTENT: {
    visible: false,
    isShowTitle: true,
    isShowIcon: true,
    isShowTooltip: true,
    title: '',
    icon: '',
    disabled: false,
    placement: 'RT',
    offset: [0, 60],
    hasDivider: false,
    tooltip: '',
    tooltipPlacement: 'top',
    tooltipColor: '#3056e3',
    isVertical: false,
    height: '40px',
    containerType: 'drawer',
    containerWidth: '400px',
    contaienrMask: false,
  },
};
export const GIAC_PROPS = {
  GI_CONTAINER_INDEX: 0,
  GIAC: {
    visible: false,
    disabled: false,
    isShowTitle: true,
    isShowIcon: true,
    isShowTooltip: true,
    title: '',
    icon: '',
    tooltip: '',
    tooltipPlacement: 'top',
    tooltipColor: '#3056e3',
    hasDivider: false,
    isVertical: false,
    height: '40px',
  },
};

export const GI_CONTAINER_METAS = {
  placement: {
    title: $i18n.get({ id: 'sdk.src.components.const.PlacementOrientation', dm: '放置方位' }),
    type: 'string',
    'x-decorator': 'FormItem',
    'x-component': 'Select',
    'x-component-props': {
      options: [
        {
          value: 'LT',
          label: $i18n.get({ id: 'sdk.src.components.const.TopLeftTop', dm: '左上 / top' }),
        },
        {
          value: 'RT',
          label: $i18n.get({ id: 'sdk.src.components.const.TopRightRight', dm: '右上 / right' }),
        },
        {
          value: 'LB',
          label: $i18n.get({ id: 'sdk.src.components.const.LowerLeftLeft', dm: '左下 / left' }),
        },
        {
          value: 'RB',
          label: $i18n.get({ id: 'sdk.src.components.const.BottomRightBottom', dm: '右下 / bottom' }),
        },
      ],
    },
    default: 'LT',
  },
  offset: {
    title: $i18n.get({ id: 'sdk.src.components.const.OffsetDistance', dm: '偏移距离' }),
    type: 'string',
    'x-decorator': 'FormItem',
    'x-component': 'Offset',
    default: [0, 0],
  },
  height: {
    title: $i18n.get({ id: 'sdk.src.components.const.Height', dm: '高度' }),
    type: 'string',
    'x-decorator': 'FormItem',
    'x-component': 'Input',
    'x-component-props': {},
    default: '46px',
  },
  width: {
    title: $i18n.get({ id: 'sdk.src.components.const.Width', dm: '宽度' }),
    type: 'string',
    'x-decorator': 'FormItem',
    'x-component': 'Input',
    'x-component-props': {},
    default: '100%',
  },
};

export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export type TGIAC_CONTENT = typeof GIAC_CONTENT_PROPS.GIAC_CONTENT;
export type IGIAC = typeof GIAC_PROPS.GIAC;
