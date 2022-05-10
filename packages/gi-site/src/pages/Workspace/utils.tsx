import type { GIConfig } from '@alipay/graphinsight';
/**
 *
 * @param
 * @returns ( ) => uuid: string
 */
export const getUid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getMockData = () => {
  return {
    nodes: [],
    edges: [],
  };
};

/**
 *
 * 默认config
 *
 */

const baseNodesConfig: GIConfig['nodes'] = [
  {
    id: 'SimpleNode',
    name: '官方节点',
    expressions: [],
    groupName: '默认样式',
    props: {
      size: 26,
      color: '#ddd',
      label: ['id'],
    },
  },
];

const baseEdgesConfig: GIConfig['edges'] = [
  {
    id: 'SimpleEdge',
    name: '官方边',
    expressions: [],
    groupName: '默认样式',
    props: {
      size: 1,
      color: '#ddd',
      label: ['source', 'target'],
    },
  },
];
const baseComponentsConfig = [
  {
    id: 'Toolbar',
    props: {
      placement: 'LT',
      direction: 'vertical',
      offset: [24, 64],
      GI_CONTAINER: ['ZoomIn', 'ZoomOut', 'FitView', 'FitCenter', 'LassoSelect'],
    },
  },
  {
    id: 'ZoomIn',
    props: {},
  },
  {
    id: 'ZoomOut',
    props: {},
  },
  {
    id: 'FitView',
    props: {},
  },
  {
    id: 'FitCenter',
    props: {},
  },
  {
    id: 'LassoSelect',
    props: {},
  },
  /** 元素交互 */
  {
    id: 'PropertiesPanel',
    props: {},
  },
  {
    id: 'ActivateRelations',
    props: {},
  },
  {
    id: 'CanvasSetting',
    props: {},
  },
  {
    id: 'NodeLegend',
    props: {
      sortKey: 'type',
    },
  },
];
const baseLayoutConfig = {
  id: 'GraphinForce',
  props: {
    type: 'graphin-force',
    preset: {
      type: 'concentric',
    },
  },
};

export const baseConfig = {
  nodes: baseNodesConfig,
  edges: baseEdgesConfig,
  layout: baseLayoutConfig,
  components: baseComponentsConfig,
};

export const activeAssetsKeys = {
  elements: [...baseNodesConfig.map(n => n.id), ...baseEdgesConfig.map(e => e.id)],
  components: [...baseComponentsConfig.map(c => c.id)],
  layouts: ['GraphinForce', 'Concentric', 'Dagre'],
};

export const serviceConfig = [
  {
    id: 'GI_SERVICE_INTIAL_GRAPH',
    content: `export default (localData)=>{
      return new Promise((resolve)=>{
        resolve(localData)
      })
    }`,
    mode: 'MOCK',
    name: '初始化接口',
  },
];

export const schemaData = {
  nodes: [],
  edges: [],
};
