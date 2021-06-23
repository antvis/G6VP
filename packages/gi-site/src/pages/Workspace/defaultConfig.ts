export const defaultConfig = {
  /** 燎原计划 */
  dataKg: {
    components: [
      {
        id: 'Legend',
        meta: {},
        props: {},
        enable: true,
      },
      {
        id: 'Liaoyuan-Click-Entity-Node',
        meta: {},
        props: {},
        enable: true,
      },
      {
        id: 'Liaoyuan-Click-Event-Node',
        meta: {},
        props: {},
        enable: true,
      },
    ],
    node: [
      {
        id: 'graphin-node',
        enable: true,
        /** style.keyshape.color */
        color: [
          {
            mode: 'mapping',
            key: 'type',
            enum: ['grey', 'blue', 'green', 'yellow', 'pink'],
            enable: true,
          },
        ],
        /** style.keyshape.size */
        size: [
          /** 第一种是映射模式 */
          {
            mode: 'mapping',
            key: 'type',
            enum: [40, 20, 30, 20, 10],
            enable: true,
          },
        ],
        /** style.label */
        label: {
          key: 'id',
        },
      },
    ],
    edge: [
      {
        id: 'graphin-edge',
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
    ],
    layout: {
      type: 'dagre', //'graphin-force',
      options: {
        rankdir: 'LR', // 可选，默认为图的中心
        align: undefined, // 可选
        nodesep: 15, // 可选
        ranksep: 40, // 可选
      },
    },
  },
  /** 　网商图谱 */
  knowledgeGraph: {
    components: [
      {
        id: 'NodeContextMenu',
        meta: {},
        props: {},
        enable: true,
      },
    ],
    node: [
      {
        id: 'graphin-node',
        categoryId: 'node',
        enable: true,
        color: [
          {
            mode: 'mapping',
            key: 'entityTypeName',
            enum: ['grey', 'blue', 'green', 'yellow', 'pink'],
            enable: true,
          },
        ],
        size: [
          {
            mode: 'fixed',
            value: 30,
            enable: true,
          },
        ],
      },
    ],
    layout: {
      categoryId: 'layout',
      type: 'graphin-force',
      options: {
        preset: {
          type: 'concentric',
        },
      },
    },
  },
  /** 前端大学图谱 */
  GIConfig: {
    components: [
      {
        id: 'Legend',
        meta: {},
        props: {},
        enable: false,
      },
      {
        id: 'NodeContextMenu',
        meta: {},
        props: {},
        enable: true,
      },
    ],
    node: [
      {
        id: 'graphin-node',
        enable: true,
        /** style.keyshape.color */
        color: [
          /** 第一种是映射模式 */
          {
            mode: 'mapping',
            key: 'type',
            enum: ['grey', 'blue', 'green', 'yellow', 'pink'],
            enable: true,
          },
          /** 第二种是固定模式 */
          {
            mode: 'fixed',
            value: 'red',
            enable: false,
          },
        ],
        /** style.keyshape.size */
        size: [
          /** 第一种是映射模式 */
          {
            mode: 'mapping',
            key: 'type',
            enum: [40, 20, 30, 20, 10],
            enable: true,
          },
          /** 第二种是固定模式 */
          {
            mode: 'fixed',
            value: 30,
            enable: false,
          },
        ],
        /** style.label */
        label: {
          key: 'id',
        },
      },
    ],
    edge: [
      {
        id: 'graphin-edge',
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
    ],
    layout: {
      // id: 'dagre',
      // options: {
      //   rankdir: 'LR',
      // },
      type: 'graphin-force',
      options: {
        animation: true,
        preset: {
          type: 'concentric',
        },
      },
    },
  },
  /** 空白模版 */
  Empty: {
    components: [
      {
        id: 'Legend',
        meta: {},
        props: {},
        enable: true,
      },
      {
        id: 'NodeContextMenu',
        meta: {},
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
            mapping: true,
            scale:{
              custom: false,
              range:["#ffffcc", "#d8fbcd", "#b0f7ce", "#89f4d0", "#61f0d1"]
            },
            key: 'type',
          },
          /** style.keyshape.size */
          size: {
            key: 'weight',
            fixed: 5,
            mapping: true,
            scale: {
              custom: false,
              domain: [0, 1000],
              range: [7, 30],
            },
          },
          label: {
            key: 'id',
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
            mapping: true,
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
            mapping: true,
            scale: {
              custom: false,
              domain: [0, 1000],
              range: [7, 30],
            },
          },
          /** style.label */
          label: {
            key: 'id',
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
