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
        GI_CONTAINER: [],
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
  name: '我的自定义模版',
  id: 'MY_TEMPLATE',
  desc: '我的自定义模版',
  image: `/image/tp_simple.png`,
  activeAssetsKeys,
  ...config,
};
