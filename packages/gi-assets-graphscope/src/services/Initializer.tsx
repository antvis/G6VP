import { GraphSchemaData, utils } from '@antv/gi-sdk';
import request from 'umi-request';
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

  service: async (): Promise<GraphSchemaData> => {
    const graphName = localStorage.getItem('graphScopeGraphName') as string;
    const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER');
    const result = await request(`${httpServerURL}/graphcompute/schema`, {
      method: 'GET',
      params: {
        graphName,
      },
    });
    return result;
  },
};
