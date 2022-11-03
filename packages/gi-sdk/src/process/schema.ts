import type { GIConfig, GIEdgeConfig, GINodeConfig } from '../typing';
export const isObjectEmpty = obj => {
  return Object.keys(obj).length === 0;
};

export interface IGraphData {
  nodes: any[];
  edges: any[];
}

export interface INodeSchema {
  /** 节点类型 */
  nodeType: string;
  /** 节点类型，通过业务数据（data）中的哪个字段映射的 */
  nodeTypeKeyFromProperties: string;
  /** 业务数据（data）中的字段类型，目前不支持嵌套 */
  properties: {
    [key: string]: 'string' | 'number' | 'date';
  };
}

export interface IEdgeSchema {
  /** 边类型 */
  edgeType: string;
  /** 边类型，通过业务数据（data）中的哪个字段映射的 */
  edgeTypeKeyFromProperties: string;
  /** 边上开端节点类型 */
  sourceNodeType?: string;
  /** 边上目标节点类型 */
  targetNodeType?: string;
  /** 业务数据（data）中的字段类型，目前不支持嵌套 */
  properties: {
    [key: string]: 'string' | 'number' | 'date';
  };
}

export interface GraphSchemaData {
  nodes: INodeSchema[];
  edges: IEdgeSchema[];
  /** Schema 额外配置信息 */
  meta?: {
    /** 默认的标签映射字段 */
    defaultLabelField: string;
  };
}

/**
 * 通过 graphData 生成 Schema
 * @param graphData 图数据
 */
export const generatorSchemaByGraphData = (graphData: IGraphData, defaultOptions?: any): GraphSchemaData => {
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

export const COLORS = [
  '#3056E3',
  '#faad14',
  '#a0d911',
  '#f5222d',
  '#722ed1',
  '#eb2f96',
  '#2f54eb',
  '#13c2c2',
  '#52c41a',
  '#fadb14',
  '#fa8c16',
  '#820014',
  '#873800',
  '#874d00',
  '#876800',
  '#3f6600',
  '#135200',
  '#00474f',
  '#003a8c',
  '#061178',
  '#22075e',
  '#780650',
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

export const generatorStyleConfigBySchema = (schema: GraphSchemaData, config: GIConfig = {}): GIConfig => {
  const { nodes, edges, meta = { defaultLabelField: 'id' } } = schema;
  const { defaultLabelField } = meta;

  let hasUnkownNodeType = false;
  let hasUnkownEdgeType = false;

  const nodesConfig = nodes
    .map((c, index) => {
      const COLOR_INDEX = index % COLORS.length;

      colorMap.set(c.nodeType, COLORS[COLOR_INDEX]);
      if (c.nodeType === 'UNKNOW') {
        hasUnkownNodeType = true;
        return { ...defaultNodeConfig };
      }
      return {
        id: 'SimpleNode',
        props: {
          size: 26,
          color: COLORS[COLOR_INDEX] || '#ddd',
          label: [`${c.nodeType}^^${defaultLabelField}`],
          // label:[[c.nodeType,defaultLabelField]]
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
        groupName: `${String(c.nodeType).toUpperCase()} TYPE`,
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
        groupName: `${String(c.edgeType).toUpperCase()} TYPE`,
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

const mergeElementConfig = (curr: GINodeConfig[], prev: GINodeConfig[]): GINodeConfig[] => {
  const prevMap = new Map();
  prev.forEach(c => {
    const id = JSON.stringify(c.expressions);
    prevMap.set(id, c);
  });
  return curr.map(c => {
    const id = JSON.stringify(c.expressions);
    const prev = prevMap.get(id);
    if (prev) {
      return prev;
    } else {
      return c;
    }
  });
};

/**
 * 通过缓存策略，将之前的Config配置作用在新的Config上
 * @param curr 当前新产生的 NodesConfig or EdgeConfig
 * @param prev 之前的 NodesConfig or EdgeConfig
 * @returns
 */
export const mergeStyleConfig = (
  curr: { nodes: GINodeConfig[]; edges: GIEdgeConfig[] },
  prev: { nodes: GINodeConfig[]; edges: GIEdgeConfig[] },
) => {
  const nodes = mergeElementConfig(curr.nodes, prev.nodes) as GINodeConfig[];
  const edges = mergeElementConfig(curr.edges, prev.edges) as GIEdgeConfig[];
  return {
    nodes,
    edges,
  };
};
