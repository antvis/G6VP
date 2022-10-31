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
  res: ``,
  service: async (): Promise<GraphData> => {
    return fetch('https://gw.alipayobjects.com/os/bmw-prod/9f4dda70-b095-4da1-8c64-c0ac063940a2.json').then(res => {
      return res.json();
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
    return {
      nodes: [],
      edges: [],
    };
  },
};
