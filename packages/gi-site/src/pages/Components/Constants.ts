export const components = {
  title: '组件市场',
  children: [
    {
      title: '信息查看',
      children: [
        {
          title: '信息提示框',
        },
      ],
    },
  ],
};

export const events = {
  title: '交互事件',
  children: [
    {
      title: '画布',
      children: [
        {
          title: '点击',
        },
      ],
    },
    {
      title: '节点',
    },
    {
      title: '布',
    },
  ],
};

export const materials = {
  title: '物料市场',
  children: [
    {
      title: '节点',
      children: [
        {
          title: '圆',
        },
      ],
    },
    {
      title: '边',
    },
    {
      title: '布局',
    },
  ],
};

export const TYPE_MAPPING = {
  // 1 表示组件
  comopnent: 1,
  // 2 表示图元素
  element: 2,
  // 3 表示数据服务
  service: 3,
};

export const TYPE_MAPPING_TR = {
  // 1 表示组件
  1: '组件',
  // 2 表示图元素
  2: '元素',
  // 3 表示数据服务
  3: '数据服务',
};
