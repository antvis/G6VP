export const defaultConfig = {
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
          /** 第一种是映射模式 */
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
      id: 'dagre', //'graphin-force',
      options: {
        rankdir: 'LR', // 可选，默认为图的中心
        align: undefined, // 可选
        nodesep: 15, // 可选
        ranksep: 40, // 可选
      },
    },
  },
  knowledgeGraph: {
    components: [],
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
      id: 'graphin-force',
      options: {
        preset: {
          type: 'concentric',
        },
      },
    },
  },

  riskControl: {
    components: [
      {
        id: 'Legend',
        categoryId: 'legend',
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

        categoryId: 'node',
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
        size: [
          {
            mode: 'fixed',
            value: 30,
            enable: false,
          },
        ],
        /** style.label */
        label: {
          key: 'name',
        },
      },
    ],
    edge: [
      {
        id: 'graphin-edge',
        categoryId: 'edge',
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
          key: 'name',
        },
      },
    ],
    layout: {
      categoryId: 'layout',
      id: 'dagre',
      options: {
        rankdir: 'LR',
      },
    },
    graph: {},
  },

  GIConfig: {
    components: [
      {
        id: 'Legend',
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
      id: 'graphin-force',
      options: {
        animation: false,
        preset: {
          type: 'concentric',
        },
      },
    },
  },
};
