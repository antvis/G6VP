export const config = {
  node: {
    id: 'MyNode',
    props: {},
  },
  edge: {
    id: 'MyEdge',
    props: {},
  },
  components: [],
  layout: {
    id: 'graphin-force',
    props: {},
  },
};

export const services = [
  {
    id: 'GI_SERVICE_INTIAL_GRAPH',
    service: () => {
      return new Promise(resolve => {
        resolve({
          nodes: [
            { id: 'node-1', data: {} },
            { id: 'node-2', data: {} },
          ],
          edges: [{ source: 'node-1', target: 'node-2', data: {} }],
        });
      });
    },
  },
];
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
          type: 'graphin-circle',
          data: edge,
        };
      });
    },
  },
};
export const components = {};

export const assets = {
  services,
  elements,
  components,
};
