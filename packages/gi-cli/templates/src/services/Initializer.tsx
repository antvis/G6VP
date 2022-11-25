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
import { utils } from '@antv/gi-sdk';
const {
  // getServerEngineContext,
  generatorSchemaByGraphData,
} = utils;

/**
 * 获取服务引擎的上下文
 * @returns
 */
export const getServerEngineContext = () => {
  try {
    const ContextString = localStorage.getItem('SERVER_ENGINE_CONTEXT') || '{}';
    return JSON.parse(ContextString);
  } catch (error) {
    console.error(error);
    return {};
  }
};

const transform = data => {
  return {
    nodes: data.nodes.map(item => {
      return {
        id: item.id,
        data: item,
        nodeType: item.icon ? item.icon : item['type'],
        nodeTypeKeyFromProperties: item.icon ? 'icon' : 'type',
      };
    }),
    edges: data.edges.map(item => {
      const { source, target } = item;
      return {
        data: item,
        source,
        target,
        edgeType: item.category ? item.category : item['type'],
        edgeTypeKeyFromProperties: item.category ? 'category' : 'type',
      };
    }),
  };
};
export const GI_SERVICE_INTIAL_GRAPH = {
  name: '初始化查询',
  method: 'GET',
  req: ``,
  res: ``,
  service: async (): Promise<GraphData> => {
    const context = getServerEngineContext();
    const { CASE_URL } = context;
    return fetch(CASE_URL)
      .then(res => {
        return res.json();
      })
      .then(res => {
        return transform(res);
      });
  },
};

export const GI_SERVICE_SCHEMA = {
  name: '查询图模型',
  method: 'GET',
  req: ``,
  res: `
`,
  service: async (): Promise<any> => {
    const context = getServerEngineContext();
    const { CASE_URL } = context;
    return fetch(CASE_URL)
      .then(res => {
        return res.json();
      })
      .then(res => {
        return transform(res);
      })
      .then(res => {
        return generatorSchemaByGraphData(res);
      });
  },
};
