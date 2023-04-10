import {
  BarChartOutlined,
  BgColorsOutlined,
  BranchesOutlined,
  CarryOutOutlined,
  ConsoleSqlOutlined,
  InsertRowBelowOutlined,
  PieChartOutlined,
  QuestionCircleOutlined,
  SelectOutlined,
  SlackOutlined,
} from '@ant-design/icons';

export const CategroyOptions = {
  'container-components': {
    name: '容器组件',
    icon: <InsertRowBelowOutlined />,
    order: 0,
  },
  'canvas-interaction': {
    name: '画布交互',
    icon: <SelectOutlined />,
    order: 1,
  },
  'elements-interaction': {
    name: '元素交互',
    icon: <PieChartOutlined />,
    order: 2,
  },
  'node-interaction': {
    name: '节点交互',
    icon: <PieChartOutlined />,
    order: 3,
  },
  'system-interaction': {
    name: '系统交互',
    icon: <SlackOutlined />,
    order: 4,
  },
  'styling-analysis': {
    name: '样式分析',
    icon: <BgColorsOutlined />,
    order: 5,
  },
  'data-analysis': {
    name: '数据分析',
    icon: <BarChartOutlined />,
    order: 6,
  },

  'layout-analysis': {
    name: '布局分析',
    icon: <BranchesOutlined />,
    order: 7,
  },
  'data-query': {
    name: '数据查询',
    icon: <ConsoleSqlOutlined />,
    order: 8,
  },
  'algorithm-analysis': {
    name: '算法分析',
    icon: <PieChartOutlined />,
    order: 9,
  },
  'scene-analysis': {
    name: '场景分析',
    icon: <PieChartOutlined />,
    order: 10,
  },
  workbook: {
    name: '工作簿',
    icon: <CarryOutOutlined />,
    order: 11,
  },
};
export const otherCategory = {
  name: '未分类',
  icon: <QuestionCircleOutlined />,
  order: 12,
};

export const COLOR_MAP = {
  basic: 'green',
  advance: 'volcano',
  scene: 'purple',
  undefined: '#f50',
};
