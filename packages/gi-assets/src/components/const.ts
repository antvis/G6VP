export const defaultMeta = {
  GI_CONTAINER_INDEX: {
    name: '排序位置',
    type: 'stepper',
    step: 1,
    min: 0,
    max: 15,
    default: 2,
  },

  GI_CONTAINER_ITEM: {
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
        default: 'icon',
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
  },
};

export const defaultProps = {
  GI_CONTAINER_INDEX: 0,
  GI_CONTAINER_ITEM: {
    visible: true,
    isShowTitle: true,
    isShowIcon: true,
    title: '',
    icon: '',
    placement: 'LT',
    offset: [10, 60],
    hasDivider: false,
    color: '#3056e3',
  },
};

export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};
