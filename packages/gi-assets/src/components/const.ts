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
    placement: {
      name: '组件位置',
      type: 'select',
      default: 'LT',
      options: [
        {
          value: 'LT',
          label: '左上',
        },
        {
          value: 'RT',
          label: '右上',
        },
        {
          value: 'LB',
          label: '左下',
        },
        {
          value: 'RB',
          label: '右下',
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
    hasDivider: {
      name: '分隔符',
      type: 'switch',
      default: false,
    },
    color: {
      name: '提示颜色',
      type: 'fill',
      default: '#3056e3',
    },
    isVertical: {
      name: '垂直排列',
      type: 'switch',
      default: false,
      showInPanel: {
        conditions: [
          ['.isShowIcon', '$eq', true],
          ['.isShowTitle', '$eq', true],
        ],
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
    hasDivider: {
      name: '分隔符',
      type: 'switch',
      default: false,
    },
    color: {
      name: '提示颜色',
      type: 'fill',
      default: '#3056e3',
    },
    isVertical: {
      name: '垂直排列',
      type: 'switch',
      default: false,
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
    title: '',
    icon: '',
    placement: 'LT',
    offset: [10, 60],
    hasDivider: false,
    color: '#3056e3',
    isVertical: false,
  },
};
export const GIAC_PROPS = {
  GI_CONTAINER_INDEX: 0,
  GIAC: {
    visible: false,
    isShowTitle: true,
    isShowIcon: true,
    title: '',
    icon: '',
    hasDivider: false,
    color: '#3056e3',
    isVertical: false,
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
        label: '左上',
      },
      {
        value: 'RT',
        label: '右上',
      },
      {
        value: 'LB',
        label: '左下',
      },
      {
        value: 'RB',
        label: '右下',
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
