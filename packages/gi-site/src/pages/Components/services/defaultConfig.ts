import data from '../../../mock/demo.json';

export const defaultConfig = {
  components: [],
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
};

export const getGraphData = () => {
  return new Promise(resolve => {
    const nodes = data.nodes.map(n => {
      return {
        id: n.id,
        data: n,
      };
    });
    const edges = data.edges.map(e => {
      return {
        source: e.source,
        target: e.target,
        data: e,
      };
    });
    resolve({ nodes, edges });
  });
};
