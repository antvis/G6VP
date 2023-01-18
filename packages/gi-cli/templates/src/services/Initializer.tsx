import { GIGraphData, utils } from '@antv/gi-sdk';
const { getServerEngineContext, generatorSchemaByGraphData } = utils;

export const GI_SERVICE_INTIAL_GRAPH = {
  name: '初始化查询',
  method: 'GET',
  req: ``,
  res: ``,
  service: async (): Promise<GIGraphData> => {
    const context = getServerEngineContext();
    console.log('context', context);
    const { initialQuery } = context;
    if (initialQuery === '') {
      return {
        nodes: [],
        edges: [],
      };
    }
    return fetch(initialQuery)
      .then(res => {
        return res.json();
      })
      .catch(() => {
        return {
          nodes: [],
          edges: [],
        };
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
    const { schemaQuery, initialQuery } = context;
    if (schemaQuery === '') {
      return fetch(initialQuery)
        .then(res => {
          return res.json();
        })
        .then(res => {
          return generatorSchemaByGraphData(res);
        })
        .catch(() => {
          return {
            nodes: [],
            edges: [],
          };
        });
    }
    return fetch(schemaQuery)
      .then(res => {
        return res.json();
      })
      .catch(() => {
        return {
          nodes: [],
          edges: [],
        };
      });
  },
};
