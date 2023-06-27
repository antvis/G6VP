import { template } from '@antv/gi-sdk';
import $i18n from '../i18n';

const pageLayout = {
  id: 'SegmentedLayout',
  name: $i18n.get({ id: 'basic.src.templates.Simple.SegmentLayout', dm: '分段布局' }),
  props: {
    containers: [
      {
        id: 'GI_CONTAINER_SIDE',
        name: $i18n.get({ id: 'basic.src.templates.Simple.SideContainer', dm: '侧边容器' }),
        required: true,
        GI_CONTAINER: ['FilterPanel'],
        display: true,
      },
    ],
  },
};

const components = [...template.components, pageLayout];

export const config = {
  nodes: template.nodes,
  edges: template.edges,
  layout: template.layout,
  components,
  pageLayout,
};

export const activeAssetsKeys = {
  elements: [...config.nodes.map(n => n.id), ...config.edges.map(e => e.id)],
  components: [...components.map(c => c.id)],
  layouts: ['Force2', 'Concentric', 'Dagre', 'FundForce', 'GraphinForce'],
};

export default {
  name: $i18n.get({ id: 'basic.src.templates.Simple.MinimalistTemplate', dm: '极简模版' }),
  id: 'TP_SIMPLE',
  desc: $i18n.get(
    {
      id: 'basic.src.templates.Simple.ThisTemplateIsAnOfficial',
      dm: '该模版是官方提供的极简模版，包含 {activeAssetsKeysComponentsLength} 个分析资产，提供常见的「交互分析」「筛选看数」等功能，页面布局上，画布展示空间较大，提供沉浸式分析体验',
    },
    { activeAssetsKeysComponentsLength: activeAssetsKeys.components.length },
  ),
  image: `/image/tp_simple.png`,
  activeAssetsKeys,
  ...config,
};
