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
import $i18n from '../../i18n';

export const CategroyOptions = {
  'container-components': {
    name: $i18n.get({ id: 'gi-site.components.AssetsCenter.constants.ContainerComponents', dm: '容器组件' }),
    icon: <InsertRowBelowOutlined />,
    order: 1,
  },
  'canvas-interaction': {
    name: $i18n.get({ id: 'gi-site.components.AssetsCenter.constants.CanvasInteraction', dm: '画布交互' }),
    icon: <SelectOutlined />,
    order: 2,
  },
  'elements-interaction': {
    name: $i18n.get({ id: 'gi-site.components.AssetsCenter.constants.ElementInteraction', dm: '元素交互' }),
    icon: <PieChartOutlined />,
    order: 3,
  },
  'node-interaction': {
    name: $i18n.get({ id: 'gi-site.components.AssetsCenter.constants.NodeInteraction', dm: '节点交互' }),
    icon: <PieChartOutlined />,
    order: 3,
  },
  'system-interaction': {
    name: $i18n.get({ id: 'gi-site.components.AssetsCenter.constants.SystemInteraction', dm: '系统交互' }),
    icon: <SlackOutlined />,
    order: 4,
  },
  'styling-analysis': {
    name: $i18n.get({ id: 'gi-site.components.AssetsCenter.constants.StyleAnalysis', dm: '样式分析' }),
    icon: <BgColorsOutlined />,
    order: 5,
  },
  'data-analysis': {
    name: $i18n.get({ id: 'gi-site.components.AssetsCenter.constants.DataAnalysis', dm: '数据分析' }),
    icon: <BarChartOutlined />,
    order: 6,
  },

  'layout-analysis': {
    name: $i18n.get({ id: 'gi-site.components.AssetsCenter.constants.LayoutAnalysis', dm: '布局分析' }),
    icon: <BranchesOutlined />,
    order: 7,
  },
  'data-query': {
    name: $i18n.get({ id: 'gi-site.components.AssetsCenter.constants.DataQuery', dm: '数据查询' }),
    icon: <ConsoleSqlOutlined />,
    order: 8,
  },
  'algorithm-analysis': {
    name: $i18n.get({ id: 'gi-site.components.AssetsCenter.constants.AlgorithmAnalysis', dm: '算法分析' }),
    icon: <PieChartOutlined />,
    order: 9,
  },
  'scene-analysis': {
    name: $i18n.get({ id: 'gi-site.components.AssetsCenter.constants.ScenarioAnalysis', dm: '场景分析' }),
    icon: <PieChartOutlined />,
    order: 10,
  },
  workbook: {
    name: $i18n.get({ id: 'gi-site.components.AssetsCenter.constants.Workbook', dm: '工作簿' }),
    icon: <CarryOutOutlined />,
    order: 11,
  },
};
export const otherCategory = {
  name: $i18n.get({ id: 'gi-site.components.AssetsCenter.constants.Uncategorized', dm: '未分类' }),
  icon: <QuestionCircleOutlined />,
  order: 12,
};

export const COLOR_MAP = {
  basic: 'green',
  advance: 'volcano',
  scene: 'purple',
  undefined: '#f50',
};
