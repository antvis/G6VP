import { GraphSchemaData, utils } from '@antv/gi-sdk';
const { getServerEngineContext } = utils;
export interface GraphData {
  nodes: {
    id: string;
    nodeType: string;
    data: {};
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    edgeType: string;
    data: {};
  }[];
}

export const GI_SERVICE_INTIAL_GRAPH = {
  name: '初始化查询',
  method: 'GET',
  req: ``,
  res: `
  export interface GIGraphData {
    nodes: {
      // 节点ID
      id: string;
      // 节点类型的枚举值。Property Graph 也称之为 node.label
      nodeType: string;
      // 业务数据,注意需要打平,暂不支持嵌套
      data: {};
      // 业务数据（data）中的哪个字段，用来映射节点类型
      nodeTypeKeyFromProperties?: string;
    }[];
    edges: {
      // 边ID
      id: string;
      // 边关联的 source 节点ID
      source: string;
      // 边关联的 target 节点ID
      target: string;
      // 边类型的枚举值。Property Graph 也称之为 edge.label
      edgeType: string;
      // 业务数据,注意需要打平,暂不支持嵌套
      data: {};
      // 业务数据（data）中的哪个字段，用来映射边类型
      edgeTypeKeyFromProperties?: string;
    }[];
  }
  `,
  service: async (): Promise<GraphData> => {
    const context = getServerEngineContext();
    const { data } = context;
    return data;
  },
};

export const GI_SERVICE_SCHEMA = {
  name: '查询图模型',
  method: 'GET',
  req: ``,
  res: `
 export interface GraphSchemaData {
  nodes: {
    /** 节点类型 */
    nodeType: string;
    /** 节点类型，通过业务数据（data）中的哪个字段映射的 */
    nodeTypeKeyFromProperties: string;
    /** 业务数据（data）中的字段类型，目前不支持嵌套 */
    properties: {
      [key: string]: 'string' | 'number' | 'date';
    };
  }[];
  edges: {
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
  }[];
  /** Schema 额外配置信息 */
  meta?: {
    /** 默认的标签映射字段 */
    defaultLabelField: string;
  };
}
`,
  service: async (): Promise<GraphSchemaData> => {
    const context = getServerEngineContext();
    const { schemaData } = context;
    return schemaData;
  },
};
