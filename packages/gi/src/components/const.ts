const GIAC_CONTENT = {
  type: 'void',
  'x-decorator': 'FormItem',
  'x-component': 'FormCollapse',
  properties: {
    GIAC_CONTENT: {
      type: 'object',
      'x-decorator': 'FormItem',
      'x-component': 'FormCollapse.CollapsePanel',
      'x-component-props': {
        header: '容器配置',
      },
      properties: {
        visible: {
          title: '默认显示',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-component-props': {},
          default: false,
        },
        disabled: {
          title: '功能禁用',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-component-props': {},
          default: false,
        },
        isShowTitle: {
          title: '显示名称',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-component-props': {},
          default: true,
        },
        title: {
          title: '填写名称',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            showInPanel: {
              conditions: [['.isShowTitle', '$eq', true]],
            },
          },
          default: '时序分析',
        },
        isShowIcon: {
          title: '显示图标',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-component-props': {},
          default: true,
        },
        icon: {
          title: '选择图标',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            showInPanel: {
              conditions: [['.isShowIcon', '$eq', true]],
            },
          },
          default: 'icon-star',
        },
        isShowTooltip: {
          title: '提示框',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-component-props': {},
          default: true,
        },
        tooltipColor: {
          title: '提示颜色',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'ColorInput',
          'x-component-props': {
            showInPanel: {
              conditions: [['.isShowTooltip', '$eq', true]],
            },
          },
          default: '#3056e3',
        },
        tooltipPlacement: {
          title: '提示方位',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            options: [
              {
                value: 'top',
                label: '上方',
              },
              {
                value: 'left',
                label: '左方',
              },
              {
                value: 'right',
                label: '右方',
              },
              {
                value: 'bottom',
                label: '下方',
              },
            ],
            showInPanel: {
              conditions: [['.isShowTooltip', '$eq', true]],
            },
          },
          default: 'right',
        },
        hasDivider: {
          title: '分隔符',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-component-props': {},
          default: false,
        },
        height: {
          title: '单元高度',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {},
          default: '60px',
        },
        isVertical: {
          title: '垂直排列',
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
        containerType: {
          title: '容器类型',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          enum: [
            {
              label: '抽屉',
              value: 'drawer',
            },
            {
              label: '弹窗',
              value: 'modal',
            },
            {
              label: '普通DIV',
              value: 'div',
            },
          ],
          default: 'drawer',
        },
        containerPlacement: {
          title: '容器位置',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            options: [
              {
                value: 'LT',
                label: '左上 / top',
              },
              {
                value: 'LB',
                label: '左下 / left',
              },
              {
                value: 'RT',
                label: '右上 / right',
              },
              {
                value: 'RB',
                label: '右下 / bottom',
              },
            ],
          },
          default: 'RT',
        },
        offset: {
          title: '偏移距离',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Offset',
          'x-component-props': {
            min: 0,
            max: 400,
          },
          default: [10, 60],
        },
        containerWidth: {
          title: '容器宽度',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {},
          default: '400px',
        },
        containerHeight: {
          title: '容器宽度',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {},
          default: 'calc(100vh - 120px)',
        },
        contaienrMask: {
          title: '容器遮罩',
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
  name: '容器配置',
  type: 'group',
  fold: true,
  children: {
    visible: {
      name: '默认显示',
      type: 'switch',
      default: false,
    },
    disabled: {
      name: '功能禁用',
      type: 'switch',
      default: false,
    },
    isShowTitle: {
      name: '显示名称',
      type: 'switch',
      default: true,
    },
    title: {
      name: '填写名称',
      type: 'text',
      default: '时序分析',
      showInPanel: {
        conditions: [['.isShowTitle', '$eq', true]],
      },
    },
    isShowIcon: {
      name: '显示图标',
      type: 'switch',
      default: true,
    },
    icon: {
      name: '选择图标',
      type: 'text',
      default: 'icon-star',
      showInPanel: {
        conditions: [['.isShowIcon', '$eq', true]],
      },
    },
    isShowTooltip: {
      name: '提示框',
      type: 'switch',
      default: true,
    },
    tooltip: {
      name: '填写提示框内容',
      type: 'text',
      default: '',
      showInPanel: {
        conditions: [['.isShowTooltip', '$eq', true]],
      },
    },
    tooltipColor: {
      name: '提示颜色',
      type: 'fill',
      default: '#3056e3',
      showInPanel: {
        conditions: [['.isShowTooltip', '$eq', true]],
      },
    },
    tooltipPlacement: {
      name: '提示方位',
      type: 'select',
      default: 'top',
      options: [
        {
          value: 'top',
          label: '上方',
        },
        {
          value: 'left',
          label: '左方',
        },
        {
          value: 'right',
          label: '右方',
        },
        {
          value: 'bottom',
          label: '下方',
        },
      ],
      showInPanel: {
        conditions: [['.isShowTooltip', '$eq', true]],
      },
    },
    hasDivider: {
      name: '分隔符',
      type: 'switch',
      default: false,
    },
    height: {
      name: '单元高度',
      type: 'text',
      default: '60px',
    },
    isVertical: {
      name: '垂直排列',
      type: 'switch',
      default: true,
      showInPanel: {
        conditions: [
          ['.isShowIcon', '$eq', true],
          ['.isShowTitle', '$eq', true],
        ],
      },
    },
  },
};

const GI_CONTAINER_INDEX = {
  title: '排序位置',
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
    height: '60px',
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
    height: '60px',
  },
};

export const GI_CONTAINER_METAS = {
  placement: {
    title: '放置方位',
    type: 'string',
    'x-decorator': 'FormItem',
    'x-component': 'Select',
    'x-component-props': {
      options: [
        {
          value: 'LT',
          label: '左上 / top',
        },
        {
          value: 'RT',
          label: '右上 / right',
        },
        {
          value: 'LB',
          label: '左下 / left',
        },
        {
          value: 'RB',
          label: '右下 / bottom',
        },
      ],
    },
    default: 'LT',
  },
  offset: {
    title: '偏移距离',
    type: 'string',
    'x-decorator': 'FormItem',
    'x-component': 'Offset',
    'x-component-props': {
      min: 0,
      max: 400,
    },
    default: [0, 0],
  },
  height: {
    title: '高度',
    type: 'string',
    'x-decorator': 'FormItem',
    'x-component': 'Input',
    'x-component-props': {},
    default: '60px',
  },
  width: {
    title: '宽度',
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
