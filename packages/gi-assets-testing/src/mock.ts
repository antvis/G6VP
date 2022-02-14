import { GIComponentConfig } from '@alipay/graphinsight/src/typing';
import { Utils } from '@antv/graphin';

export const config = {
  node: {
    id: 'MyNode',
    props: {},
  },
  edge: {
    id: 'MyEdge',
    props: {},
  },
  components: [] as GIComponentConfig[],
  layout: {
    id: 'GraphinForce',
    props: {
      type: 'graphin-force',
    },
  },
};

export const elements = {
  MyNode: {
    info: {
      id: 'MyNode',
      name: '我的节点',
    },
    registerShape: () => {},
    registerMeta: () => {},
    registerTransform: (data, meta) => {
      return data.nodes.map(node => {
        return {
          id: node.id,
          type: 'graphin-circle',
          data: node,
          style: {
            label: {
              value: node.id,
            },
          },
        };
      });
    },
  },
  MyEdge: {
    info: {
      id: 'MyEdge',
      name: '我的边',
    },
    registerShape: () => {},
    registerMeta: () => {},
    registerTransform: (data, meta) => {
      return data.edges.map(edge => {
        return {
          source: edge.source,
          target: edge.target,
          type: 'graphin-line',
          data: edge,
        };
      });
    },
  },
};

export const layouts = {
  GraphinForce: {
    info: {
      id: 'GraphinForce',
      name: '力导',
      type: 'graphin-force',
    },
    registerLayout: () => {},
    registerMeta: () => {},
  },
};
export const components = {};

export const services = [
  {
    id: 'GI_SERVICE_INTIAL_GRAPH',
    service: () => {
      return new Promise(resolve => {
        resolve(Utils.mock(6).tree().graphin());
      });
    },
  },
];

export const assets = {
  elements,
  layouts,
  components,
};
