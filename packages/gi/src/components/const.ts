const GIAC_CONTENT = {
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

    containerType: {
      name: '容器类型',
      type: 'radio',
      default: 'drawer',
      options: [
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
    },
    containerPlacement: {
      name: '容器位置',
      type: 'select',
      default: 'RT',
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
    offset: {
      name: '偏移距离',
      type: 'Offset',
      min: 0,
      max: 400,
      default: [10, 60],
    },
    containerWidth: {
      name: '容器宽度',
      type: 'text',
      default: '400px',
    },
    containerHeight: {
      name: '容器宽度',
      type: 'text',
      default: 'calc(100vh - 120px)',
    },
    contaienrMask: {
      name: '容器遮罩',
      type: 'switch',
      default: false,
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
  name: '排序位置',
  type: 'stepper',
  step: 1,
  min: 0,
  max: 15,
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
    name: '放置方位',
    type: 'select',
    default: 'LT',
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
  offset: {
    name: '偏移距离',
    type: 'Offset',
    min: 0,
    max: 400,
    default: [0, 0],
  },
  height: {
    name: '高度',
    type: 'text',
    default: '60px',
  },
  width: {
    name: '宽度',
    type: 'text',
    default: '100%',
  },
};
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export type TGIAC_CONTENT = typeof GIAC_CONTENT_PROPS.GIAC_CONTENT;
export type IGIAC = typeof GIAC_PROPS.GIAC;
