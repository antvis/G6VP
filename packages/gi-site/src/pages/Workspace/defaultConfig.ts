const  knowledgeGraph = {
    components: [],
    node: [{
        id: 'graphin-node',
        categoryId: 'node',
        enable: true, 
        color: [
        {
            mode: 'mapping',
            key: 'entityTypeName',
            enum: ['grey', 'blue', 'green', 'yellow', 'pink'],
            enable: true,
          }],
        size: [{
            mode: 'fixed',
            value: 30,
            enable: true,
        }]
    }],
    layout: {
        categoryId: 'layout',
        id: 'graphin-force',
        options: {
            preset: {
            type: 'concentric',
            },
        }
    }
}

const riskControl = {
    components: [
      {
        id: 'LEGEND-A',
        categoryId: 'legend',
        meta: {},
        props: {},
        enable: true,
      }
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
}

export default { knowledgeGraph, riskControl }