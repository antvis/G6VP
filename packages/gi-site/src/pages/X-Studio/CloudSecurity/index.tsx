import json from '../../../mock/cloud-security.json';
const config = {
  nodes: [
    {
      id: 'SimpleNode',
      props: {
        label: ['Name', 'Type'],
        size: 50,
        color: 'green',
        advanced: {
          badge: {
            type: 'text',
            value: '6',
            visible: true,
          },
        },
      },
    },
  ],
  edges: [
    {
      id: 'SimpleEdge',
      props: {},
    },
  ],
  layout: {
    id: 'Dagre',
    name: '有向分层布局',
    category: 'basic',
    props: {
      rankdir: 'LR',
      align: null,
      nodesep: 34,
      ranksep: 57,
      type: 'dagre',
    },
  },
  components: [
    {
      id: 'NodeLegend',
      props: {},
      enable: true,
    },
  ],
};

const transFunc = data => {
  const { nodes, edges } = data;
  return {
    nodes: nodes.map(n => {
      return {
        id: n.Id,
        data: n,
      };
    }),
    edges: edges.map(e => {
      return {
        source: e.StartId,
        target: e.EndId,
        data: e,
      };
    }),
  };
};
const project = {
  id: 'demo-cloud-security',
  name: '云安全',
  type: 'case',
  projectConfig: config,
  serviceConfig: [
    {
      content:
        'export default function service(params, localData) {\n      var data = params.data;\n      return new Promise(function (resolve) {\n        return resolve(data);\n      });\n    }',
      id: 'Mock/PropertiesPanel',
      mode: 'MOCK',
      name: 'Mock/PropertiesPanel',
    },
    {
      content:
        'export default (localData)=>{\n      return new Promise((resolve)=>{\n        resolve(localData)\n      })\n    }',
      id: 'GI_SERVICE_INTIAL_GRAPH',
      mode: 'MOCK',
      name: '初始化接口',
    },
  ],
  data: {
    inputData: [
      {
        data: json,
        enable: true,
        transfunc: `data => {
        const { nodes, edges } = data;
        return {
          nodes: nodes.map(n => {
            return {
              id: n.Id,
              data: n,
            };
          }),
          edges: edges.map(e => {
            return {
              source: e.StartId,
              target: e.EndId,
              data: e,
            };
          }),
        };
      }`,
        name: 'security-cloud.json',
      },
    ],
    transData: transFunc(json),
  },
  activeAssetsKeys: {
    components: ['PropertiesPanel'],
    elements: ['SimpleNode', 'SimpleEdge'],
    layouts: ['GraphinForce', 'Concentric', 'Dagre'],
  },
};

export default project;
