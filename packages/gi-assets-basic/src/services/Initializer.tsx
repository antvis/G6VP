import { GraphSchemaData, utils } from '@alipay/graphinsight';
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
  {
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
  {
    nodes: {
      nodeType: string;
      nodeTypeKeyFromProperties: string;
      properties: {
        [key: string]: any;
      };
    }[];
    edges: {
      edgeType: string;
      edgeTypeKeyFromProperties: string;
      properties: {
        [key: string]: any;
      };
    }[];
  }
`,
  service: async (): Promise<GraphSchemaData> => {
    const context = getServerEngineContext();
    const { schemaData } = context;
    return schemaData;
  },
};
