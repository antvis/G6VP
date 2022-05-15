import type { GIConfig } from '../typing';
export const isObjectEmpty = obj => {
  return Object.keys(obj).length === 0;
};

export interface IGraphData {
  nodes: any[];
  edges: any[];
}

export interface INodeSchema {
  nodeType: string;
  nodeTypeKeyFromProperties: string;
  properties: Object;
}

export interface IEdgeSchema {
  edgeType: string;
  edgeTypeKeyFromProperties: string;
  sourceNodeType: string;
  targetNodeType: string;
  properties: Object;
}
export interface IGraphSchema {
  nodes: INodeSchema[];
  edges: IEdgeSchema[];
}

/**
 * 通过 graphData 生成 Schema
 * @param graphData 图数据
 */
export const generatorSchemaByGraphData = (graphData: IGraphData, defaultOptions?: any): IGraphSchema => {
  const { nodes, edges } = graphData;
  const nodeSchemas: INodeSchema[] = [];
  const edgeSchemas: IEdgeSchema[] = [];
  const {
    nodeType: defaultNodeType = 'UNKNOW',
    edgeType: defaultEdgeType = 'UNKNOW',
    nodeTypeFromProperties: defaultNodeTypeFromProperties,
    edgeTypeFromProperties: defaultEdgeTypeFromProperties,
  } = defaultOptions || {};

  nodes.forEach(node => {
    const { nodeType = defaultNodeType, data, nodeTypeKeyFromProperties = defaultNodeTypeFromProperties } = node;
    const nodeSchema = {
      nodeType: nodeType,
      nodeTypeKeyFromProperties,
      properties: {},
    };

    for (const key in data) {
      if (typeof data[key] === 'object') {
        // 说明包括的是一个对象，需要再把里面的属性值解构出来
        for (const subKey in data[key]) {
          // 只处理这一层的非 object 的字段，其他的不再作为 schema 的属性
          if (typeof data[key][subKey] !== 'object') {
            nodeSchema.properties[`${key}.${subKey}`] = typeof data[key][subKey];
          }
        }
      } else {
        nodeSchema.properties[key] = typeof data[key];
      }
    }

    const hasCurrent = nodeSchemas.find(schema => schema.nodeType === nodeType);
    if (!hasCurrent) {
      nodeSchemas.push(nodeSchema);
    }
  });

  edges.forEach(edge => {
    const {
      edgeType = defaultEdgeType,
      source,
      target,
      data,
      edgeTypeKeyFromProperties = defaultEdgeTypeFromProperties,
    } = edge;
    const edgeSchema = {
      edgeType: edgeType,
      edgeTypeKeyFromProperties,
      sourceNodeType: '',
      targetNodeType: '',
      properties: {},
    };

    // 获取当前 source 对应的 nodeType
    const currentSource = nodes.find(node => node.id === source);
    const currentTarget = nodes.find(node => node.id === target);
    if (!currentSource) {
      console.warn('数据不合法,找不到 Source ID：', source);
    }
    if (!currentTarget) {
      console.warn('数据不合法,找不到 Target ID：', target);
    }
    if (currentSource && currentTarget) {
      edgeSchema.sourceNodeType = currentSource.nodeType;
      edgeSchema.targetNodeType = currentTarget.nodeType;
    }

    for (const key in data) {
      if (typeof data[key] === 'object') {
        // 说明包括的是一个对象，需要再把里面的属性值解构出来
        for (const subKey in data[key]) {
          // 只处理这一层的非 object 的字段，其他的不再作为 schema 的属性
          if (typeof data[key][subKey] !== 'object') {
            edgeSchema.properties[`${key}.${subKey}`] = typeof data[key][subKey];
          }
        }
      } else {
        edgeSchema.properties[key] = typeof data[key];
      }
    }

    const hasCurrent = edgeSchemas.find(schema => schema.edgeType === edgeType);
    if (!hasCurrent) {
      edgeSchemas.push(edgeSchema);
    }
  });

  return {
    nodes: nodeSchemas,
    edges: edgeSchemas,
  };
};

const NODE_COLORS = [
  '#3056E3',
  '#F58CCB',
  '#795AE1',
  '#622CD8',
  '#82E6C7',
  '#F6D87B',
  '#F69F7F',
  '#E96075',
  '#CB6EF8',
  '#85C98E',
  '#3E34E5',
  '#2959C1',
  '#4D92DE',
  '#5CB5D4',
  '#B9D569',
];

const colorMap = new Map();

const defaultNodeConfig = {
  id: 'SimpleNode',
  props: {
    size: 26,
    color: '#ddd',
    label: [],
  },
  name: '官方节点',
  order: -1,
  expressions: [],
  logic: true,
  groupName: `默认样式`,
};
const defaultEdgeConfig = {
  id: 'SimpleEdge',
  props: {
    size: 1,
    color: '#ddd',
    label: [],
  },
  name: '官方边',
  order: -1,
  expressions: [],
  logic: true,
  groupName: `默认样式`,
};

export const generatorStyleConfigBySchema = (schema: IGraphSchema, config: GIConfig = {}): GIConfig => {
  const { nodes, edges } = schema;
  let hasUnkownNodeType = false;
  let hasUnkownEdgeType = false;
  const nodesConfig = nodes
    .map((c, index) => {
      colorMap.set(c.nodeType, NODE_COLORS[index]);
      if (c.nodeType === 'UNKNOW') {
        hasUnkownNodeType = true;
        return { ...defaultNodeConfig };
      }
      return {
        id: 'SimpleNode',
        props: {
          size: 26,
          color: NODE_COLORS[index] || '#ddd',
          label: [],
        },
        name: '官方节点',
        expressions: [
          {
            name: c.nodeTypeKeyFromProperties,
            operator: 'eql',
            value: c.nodeType,
          },
        ],
        order: index,
        logic: true,
        groupName: `${c.nodeType.toUpperCase()} TYPE`,
      };
    })
    .sort((a, b) => {
      return a.order - b.order;
    });
  const edgesConfig = edges
    .map((c, index) => {
      if (c.edgeType === 'UNKNOW') {
        hasUnkownEdgeType = true;
        return {
          ...defaultEdgeConfig,
        };
      }
      return {
        id: 'SimpleEdge',
        props: {
          size: 1,
          color: colorMap.get(c.sourceNodeType) || '#ddd',
          label: [],
        },
        name: '官方边',
        expressions: [
          {
            name: c.edgeTypeKeyFromProperties,
            operator: 'eql',
            value: c.edgeType,
          },
        ],
        order: index,
        logic: true,
        groupName: `${c.edgeType.toUpperCase()} TYPE`,
      };
    })
    .sort((a, b) => {
      return a.order - b.order;
    });

  let nodesCfg = nodesConfig;
  let edgesCfg = edgesConfig;
  if (!hasUnkownNodeType) {
    nodesCfg = [defaultNodeConfig, ...nodesConfig];
  }

  if (!hasUnkownEdgeType) {
    edgesCfg = [defaultEdgeConfig, ...edgesConfig];
  }

  return {
    ...config,
    nodes: nodesCfg,
    edges: edgesCfg,
  };
};
