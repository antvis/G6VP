import { template } from '@antv/gi-sdk';

const pageLayout = {
  id: 'SegmentedLayout',
  name: '分段布局',
  props: {
    containers: [
      {
        id: 'GI_CONTAINER_SIDE',
        name: '侧边容器',
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
  name: '极简模版',
  id: 'TP_SIMPLE',
  desc: `该模版是官方提供的极简模版，包含 ${activeAssetsKeys.components.length} 个分析资产，提供常见的「交互分析」「筛选看数」等功能，页面布局上，画布展示空间较大，提供沉浸式分析体验`,
  image: `/image/tp_simple.png`,
  activeAssetsKeys,
  ...config,
};
