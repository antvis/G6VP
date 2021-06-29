const baseNodeConfig = [
  {
    id: 'graphin-node',
    enable: true,
    name: '官方内置节点',
    props: {
      /** style.keyshape.color */
      color: {
        mode: 'mapping', // fixed value
        key: 'type',
        enum: ['grey', 'blue', 'green', 'yellow', 'pink'],
        enable: true,
      },
      /** style.keyshape.size */
      size: {
        mode: 'mapping',
        key: 'type',
        enum: [40, 20, 30, 20, 10],
        enable: true,
      },
      label: {
        key: 'id',
      },
    },
  },
];
const baseEdgeConfig = [
  {
    id: 'graphin-edge',
    name: '官方内置边',
    enable: true,
    props: {
      /** style.keyshape.stroke */
      color: {
        key: 'type',
        enum: ['red', 'blue', 'green', 'yellow'],
      },
      /** style.keyshape.size */
      size: {
        key: 'weight',
      },
      /** style.label */
      label: {
        key: 'id',
      },
    },
  },
];
const baseComponentsConfig = [
  {
    id: 'NodeLegend',
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
        id: 'Liaoyuan-Click-Entity-Node',
        props: {},
        enable: true,
      },
      {
        id: 'Liaoyuan-Click-Event-Node',
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
    node: [
      {
        id: 'graphin-node',
        enable: true,
        name: '官方内置节点',
        props: {
          /** style.keyshape.color */
          color: {
            fixed: "#2483ff",
            mapping: false,
            scale:{
              custom: true,
              range:["#ffffcc", "#d8fbcd", "#b0f7ce", "#89f4d0", "#61f0d1"]
            },
            key: 'type',
          },
          /** style.keyshape.size */
          size: {
            key: 'weight',
            fixed: 5,
            mapping: false,
            scale: {
              custom: false,
              domain: [0, 1000],
              range: [7, 30],
            },
          },
          label: {
            key: 'id',
            showlabel: true,
          },
        },
      },
    ],

    edge: [
      {
        id: 'graphin-edge',
        name: '官方内置边',
        enable: true,
        props: {
          /** style.keyshape.stroke */
          color: {
            fixed: "#2483ff",
            mapping: false,
            scale: {
              custom: false,
              range: ["#ffffcc", "#d8fbcd", "#b0f7ce", "#89f4d0", "#61f0d1"]
            },
            key: 'type',
          },
          /** style.keyshape.size */
          size: {
            key: 'weight',
            fixed: 5,
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
      },
    ],
    layout: {
      // id: 'dagre',
      // options: {
      //   rankdir: 'LR',
      // },
      id: 'Layout',
      name: '官方内置布局',
      props: {
        type: 'graphin-force',
        options: {
          animation: true,
          preset: {
            type: 'concentric',
          },
        },
      },
    },
  },
};
