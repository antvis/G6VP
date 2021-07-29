const baseNodeConfig = {
  id: 'GraphinNode',
  name: '官方内置节点',
  props: {},
};
const baseEdgeConfig = {
  id: 'GraphinEdge',
  name: '官方内置边',
  props: {
    /** style.keyshape.stroke */
    color: {
      fixed: '#ddd',
      mapping: false,
      scale: {
        custom: false,
        range: ['#ffffcc', '#d8fbcd', '#b0f7ce', '#89f4d0', '#61f0d1'],
      },
      key: 'type',
    },
    /** style.keyshape.size */
    size: {
      key: 'weight',
      fixed: 1,
      mapping: false,
      scale: {
        custom: true,
        domain: [0, 1000],
        range: [7, 30],
      },
    },
    /** style.label */
    label: {
      key: 'id',
      showlabel: true,
    },
  },
};
const baseComponentsConfig = [
  {
    id: 'NodeLegend',
    props: {},
    enable: true,
  },
  {
    id: 'DrillingOne',
    props: {},
    enable: true,
  },
];
const baseLayoutConfig = {
  id: 'Layout',
  name: '官方内置布局',
  props: {
    type: 'concentric',
    options: {},
  },
};

const baseConfig = {
  node: baseNodeConfig,
  edge: baseEdgeConfig,
  layout: baseLayoutConfig,
  components: baseComponentsConfig,
};

/** 官方提供的解决方案 模版 */

export const defaultConfig = {
  /** 燎原计划 */
  knowledgeGraph: {
    ...baseConfig,
    components: [
      {
        id: 'NodeLegend',
        props: {},
        enable: true,
      },

      {
        id: 'DrillingOne',
        props: {},
        enable: true,
      },
    ],
  },
  /** 　网商图谱 */
  riskControl: {
    ...baseConfig,
    components: [
      {
        id: 'NodeContextMenu',
        props: {},
        enable: true,
      },
      {
        id: 'DrillingOne',
        props: {},
        enable: true,
      },
    ],
  },
  /** 前端大学图谱 */
  GIConfig: {
    ...baseConfig,
    components: [
      {
        id: 'NodeLegend',
        props: {},
        enable: false,
      },
      {
        id: 'NodeContextMenu',
        props: {},
        enable: true,
      },
      {
        id: 'DrillingOne',
        props: {},
        enable: true,
      },
    ],
  },
  /** 空白模版 */
  Empty: {
    ...baseConfig,
    components: [
      {
        id: 'NodeLegend',
        props: {},
        enable: true,
      },
      {
        id: 'NodeContextMenu',
        props: {},
        enable: true,
      },
    ],
  },
};
