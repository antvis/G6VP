import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

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
  components: 1,
  // 2 表示布局
  layout: 2,
  // 3 表示数据服务
  services: 3,
  // 4 表示图元素节点
  nodes: 4,
  // 5 表示图元素边
  edges: 5,
};

export const TYPE_MAPPING_TR = {
  // 1 表示组件
  1: '组件',
  // 2 表示图元素
  2: '布局',
  // 3 表示数据服务
  3: '数据服务',
  // 4 表示图元素节点
  4: '图元素-节点',
  // 4 表示图元素边
  5: '图元素-边',
};

export const STATUS_MAPPING_TR = {
  null: {
    text: '未构建',
    color: 'default',
    IconComponent: ClockCircleOutlined,
  },
  1: {
    text: '已删除',
    color: 'warning',
    IconComponent: ExclamationCircleOutlined,
  },
  2: {
    text: '构建中',
    color: 'blue',
    IconComponent: SyncOutlined,
  },
  3: {
    text: '构建失败',
    color: 'red',
    IconComponent: CloseCircleOutlined,
  },
  4: {
    text: '构建成功',
    color: 'green',
    IconComponent: CheckCircleOutlined,
  },
};
